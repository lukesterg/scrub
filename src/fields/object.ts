import {
  ScrubField,
  TypedScrubField,
  ValidationCallback,
  ValidationState,
  ObjectOptions,
  ObjectOfUserScrubFields,
} from '../types';
import { fromEntries } from '../utilities';
import { validate } from '../validator';
import { validateType } from '../validators/validateType';

const isScrubField = (val: any) => val?.validate && typeof val.validate === 'function';

type ObjectOfScrubFields<T> = { [key in keyof T]: ScrubField };

const wrapInnerObjectFieldsWithValidator = <T extends ObjectOfUserScrubFields>(
  options: ObjectOptions<T>
): ObjectOfScrubFields<T['fields']> => {
  const entries = Object.entries(options.fields);
  const objectEntries = entries.filter(([_, schema]) => !isScrubField(schema));
  if (objectEntries.length === 0) {
    return options.fields as any;
  }

  objectEntries.forEach((entry) => {
    entry[1] = object({ ...options, fields: entry[1] as any });
  });

  return fromEntries(objectEntries) as ObjectOfScrubFields<T['fields']>;
};

export const object = <T extends ObjectOfUserScrubFields>(options: ObjectOptions<T>): TypedScrubField<T> => {
  const fields = wrapInnerObjectFieldsWithValidator(options);

  const validateObject: ValidationCallback = (state: ValidationState<ObjectOptions<T>>) => {
    if (!validateType(state, 'object')) return;

    let finalValue: any = options.additionalFields === 'merge' ? state.value : {};
    const errors: any = {};

    for (const field in fields) {
      if (!(field in state.value)) {
        errors[field] = [`Please add the field ${field}`];
        finalValue = undefined;
        continue;
      }

      const validationResult = validate({ schema: fields[field], value: state.value[field] });
      if (!validationResult.success) {
        errors[field] = validationResult.errors;
        finalValue = undefined;
        continue;
      }

      if (finalValue) {
        finalValue[field] = validationResult.value;
      }
    }

    if (options.additionalFields === 'error') {
      Object.keys(state.value)
        .filter((field) => !(fields as any)[field])
        .forEach((field) => (errors[field] = ['Please remove field']));
    }

    state.setValue(finalValue);
    state.setObjectErrors(errors);
  };

  return { validate: validateObject };
};
