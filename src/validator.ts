type ObjectErrorType = { [key: string]: ErrorType };

type ErrorType = { [key: string]: string[] | ErrorType } | string[];

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

export type { ValidationState };

export interface ScrubFieldBase {
  validate: ValidationCallback;
}

export type ValidationCallback = (validate: ValidationState) => void;

export interface ValidationOptions<SchemaType extends ScrubFieldBase> {
  readonly schema: SchemaType;
  readonly value: any;
}

export interface ValidationResult<ValueType> {
  readonly success: boolean;
  readonly errors: ErrorType;
  readonly value: ValueType | undefined;
}

export const validate = <SchemaType extends ScrubFieldBase>(
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
