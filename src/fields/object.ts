import {
  copyFilteredObject,
  ErrorKeys,
  GetType,
  ObjectErrorType,
  ObjectValidatorError,
  Undefined,
  ValidationField,
  ValidatorError,
} from '../common';
import { validateType } from '../validators/validateType';

export type ValidatedType<T> = { [key in keyof T]: GetType<T[key]> };
export type ObjectAdditionalFieldType = 'strip' | 'error' | 'merge';
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
    this._cleanedFields[field] = value;
  }

  addError(message: any, field: ErrorKeys<T> = '_') {
    this._errors[field] = message;
  }
}

export type CleanCallback<T> = (state: ObjectValidationState<T>) => void;

export interface ObjectOptions<T> extends Partial<Undefined> {
  fields: T;
  additionalFields?: ObjectAdditionalFieldType;
  customValidation?: CleanCallback<T>;
}

const serializeKeys = new Set(['fields', 'onUnknownField', 'additionalFields', 'customValidation']);

export type ValidatorType = { [key: string]: ValidationField<unknown, unknown> };

class ObjectValidator<Fields extends ValidatorType, CanBeUndefined = ValidatedType<Fields>>
  extends ValidationField<ValidatedType<Fields> | CanBeUndefined, Partial<ObjectOptions<Fields>>>
  implements ObjectOptions<Fields> {
  serializeKeys = serializeKeys;
  undefined: boolean = false;
  readonly fields: Fields;
  additionalFields: ObjectAdditionalFieldType = 'strip';
  customValidation?: CleanCallback<Fields>;

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
    (clone as any).fields = field;
    clone.customValidation = undefined;
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

    this.customValidation?.(state);

    if (state.hasError) {
      throw new ObjectValidatorError(state.errors);
    }

    return state.cleanedFields as ValidatedType<Fields>;
  }
}

export function object<T extends ValidatorType>(
  options: ObjectOptions<T> & { undefined: true }
): ObjectValidator<T, undefined>;
export function object<T extends ValidatorType>(options: ObjectOptions<T>): ObjectValidator<T>;
export function object<T extends ValidatorType>(obj: T): ObjectValidator<T>;
export function object<T extends ValidatorType>(
  options: ObjectOptions<T> | T
): ObjectValidator<T, undefined> | ObjectValidator<T> {
  if (!options.fields) {
    options = { fields: options } as ObjectOptions<T>;
  }

  const object = new ObjectValidator((options as ObjectOptions<T>).fields);
  copyFilteredObject(object, options, object.serializeKeys);
  return object;
}
