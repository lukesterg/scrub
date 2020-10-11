class ValidationState<SchemaType = any> {
  constructor(value: any, schema: SchemaType) {
    this._value = value;
    this._errors = [];
  }

  private _value: any;
  get value(): any {
    return this._value;
  }

  private _errors: ErrorType;
  get errors(): ErrorType {
    return this._errors;
  }

  setValue(value: any) {
    this._value = value;
  }

  setObjectErrors(errors: ObjectErrorType) {
    if (Array.isArray(this._errors) && this._errors.length > 0) {
      throw new Error('cannot mix object errors with field errors');
    }

    this._errors = errors;
  }

  assert(condition: boolean, error: string) {
    if (!Array.isArray(this.errors)) {
      throw new Error('please use addFieldError to set errors on objects');
    }

    if (condition) {
      return true;
    }

    this.errors.push(error);
    return false;
  }
}

const validateType = (validate: ValidationState, type: TypeOfTypes): boolean =>
  validate.assert(typeof validate.value === type, `Value must be of type ${type}`);

export interface StringOptions {
  readonly empty?: boolean;
}

type ValidationCallback = (validate: ValidationState) => void;

export interface TypedScrubField<T> extends ScrubField {}
export type FieldType<T> = T extends TypedScrubField<infer U> ? U : never;
export type ObjectType<T> = { [key in keyof T]: FieldType<T[key]> };

export interface ScrubField {
  validate: ValidationCallback;
}

const isScrubField = (val: any) => val?.validate && typeof val.validate === 'function';

const string = (options: StringOptions = {}): TypedScrubField<string> => {
  const validateString: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'string')) return;
    state.assert(options?.empty || state.value !== '', 'Please enter a value');
  };

  return { validate: validateString };
};

type ObjectOfUserScrubFields = { [key: string]: ScrubField | ObjectOfUserScrubFields };
type ObjectOfScrubFields<T> = { [key in keyof T]: ScrubField };

export interface ObjectOptions<T extends ObjectOfUserScrubFields> {
  readonly additionalFields?: ObjectAdditionalFieldType;
  readonly fields: T;
}

const fromEntries = <ValueType>(entries: [string, ValueType][]) =>
  entries.reduce((last, [key, value]) => {
    last[key] = value;
    return last;
  }, {} as any) as { [key: string]: ValueType };

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

export interface ValidationOptions<SchemaType extends ScrubField> {
  readonly schema: SchemaType;
  readonly value: any;
}

export interface ValidationResult<ValueType> {
  readonly success: boolean;
  readonly errors: ErrorType;
  readonly value: ValueType | undefined;
}

export const validate = <SchemaType extends ScrubField>(
  options: Readonly<ValidationOptions<SchemaType>>
): ValidationResult<SchemaType> => {
  const state = new ValidationState(options.value, options.schema);

  options.schema.validate(state);

  const success = (Array.isArray(state.errors) ? state.errors.length : Object.keys(state.errors).length) === 0;

  return {
    success,
    errors: state.errors,
    value: success ? state.value : undefined,
  };
};

export const types = {
  string,
  object,
};
