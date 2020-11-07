import {
  arrayToCommaListString,
  copyFilteredObject,
  ErrorKeys,
  GetType,
  NoValue,
  ObjectErrorType,
  ObjectValidatorError,
  Undefined,
  ValidationField,
  ValidatorError,
} from '../common';
import { validateType } from '../validators/validateType';

export type ValidatedType<T> = { [key in keyof T]: GetType<T[key]> };
export type ObjectAdditionalFieldType = 'strip' | 'error' | 'merge';

export interface ObjectUserOptions<T> extends Partial<Undefined> {
  fields: T;
  additionalFields?: ObjectAdditionalFieldType;
}

class ObjectValidationState<T> {
  private _errors: ObjectErrorType<T> = {};
  private _cleanedFields: Partial<ValidatedType<T>> = {};

  get errors() {
    return this._errors;
  }

  get hasError() {
    return Object.keys(this._errors).length !== 0;
  }

  get cleanedFields() {
    return this._cleanedFields;
  }

  addCleanedField(value: any, field: keyof T) {
    if (value === NoValue) {
      return;
    }

    this._cleanedFields[field] = value;
  }

  addError(message: any, field: ErrorKeys<T> = '_') {
    this._errors[field] = message;
  }
}

const serializeKeys = new Set(['fields', 'onUnknownField', 'additionalFields']);

export type ValidatorType = { [key: string]: ValidationField<unknown, unknown> };

class ObjectValidator<Fields extends ValidatorType, CanBeUndefined = ValidatedType<Fields>>
  extends ValidationField<ValidatedType<Fields> | CanBeUndefined, Partial<ObjectUserOptions<Fields>>>
  implements ObjectUserOptions<Fields> {
  serializeKeys = serializeKeys;
  undefined: boolean = false;
  fields: Fields;
  additionalFields: ObjectAdditionalFieldType = 'strip';

  constructor(fields: Fields) {
    super();
    this.fields = fields;
  }

  private _getField(name: string) {
    const field = (this.fields as any)[name];
    if (field.constructor !== Object) {
      return field;
    }

    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as ObjectValidator<
      Fields,
      CanBeUndefined
    >;
    clone.fields = field;
    return clone;
  }

  serialize() {
    const result = super.serialize();
    result['fields'] = Object.keys(this.fields).reduce((last, key) => {
      last[key] = this._getField(key).serialize();
      return last;
    }, {} as any);
    return result;
  }

  private _validateField(objectValue: any, field: string) {
    if (!(field in objectValue)) {
      throw new ValidatorError(`Please add the field ${field}`);
    }

    return this._getField(field).validate(objectValue[field]);
  }

  protected _validate(value: any): ValidatedType<Fields> | undefined {
    if (value === undefined && this.undefined) {
      return value;
    }

    validateType(value, 'object');

    const state = new ObjectValidationState<Fields>();
    const keysNotInSchema = new Set(Object.keys(value));

    for (const field in this.fields) {
      keysNotInSchema.delete(field);

      try {
        const cleanedValue = this._validateField(value, field);
        state.addCleanedField(cleanedValue, field);
      } catch (e) {
        if (!(e instanceof ValidatorError)) {
          throw e;
        }

        state.addError(e instanceof ObjectValidatorError ? e.objectError : e.message, field);
      }
    }

    if (this.additionalFields === 'error') {
      keysNotInSchema.forEach((field) => state.addError('Please remove field', field));
    } else if (this.additionalFields === 'merge') {
      keysNotInSchema.forEach((key) => state.addCleanedField(value[key], key));
    }

    if (state.hasError) {
      throw new ObjectValidatorError(state.errors);
    }

    return state.cleanedFields as ValidatedType<Fields>;
  }
}

export function object<T extends ValidatorType>(
  options: ObjectUserOptions<T> & { undefined: true }
): ObjectValidator<T, undefined>;
export function object<T extends ValidatorType>(options: ObjectUserOptions<T>): ObjectValidator<T>;
export function object<T extends ValidatorType>(
  options: ObjectUserOptions<T>
): ObjectValidator<T, undefined> | ObjectValidator<T> {
  const object = new ObjectValidator(options.fields);
  copyFilteredObject(object, options, object.serializeKeys);
  return object;
}
