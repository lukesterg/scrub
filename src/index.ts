class ValidationState {
  readonly errors: string[] = [];

  private _value: any;
  get value(): any {
    return this._value;
  }

  constructor(value: any) {
    this._value = value;
  }

  assert(condition: boolean, error: string) {
    if (condition) {
      return true;
    }

    this.errors.push(error);
    return false;
  }
}

const validateType = (validate: ValidationState, type: TypeOfTypes): boolean =>
  validate.assert(typeof validate.value === type, `Value must be of type ${type}`);

interface StringOptions {
  empty: boolean;
}

type ValidationCallback = (validate: ValidationState) => void;

const string = (options: Partial<StringOptions> = {}) => {
  const result: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'string')) return;
    state.assert(options?.empty || state.value !== '', 'Please enter a value');
  };

  return result;
};

interface ValidationOptions<T> {
  schema: T;
  value: any;
}

interface ValidationResult<T> {
  success: boolean;
  errors: string[] | undefined;
  value: T | undefined;
}

export const validate = <T>(options: ValidationOptions<T>): ValidationResult<T> => {
  const state = new ValidationState(options.value);
  ((options.schema as any) as ValidationCallback)(state);

  const success = Object.keys(state.errors).length === 0;

  return {
    success,
    errors: state.errors,
    value: success ? state.value : undefined,
  };
};

export const types = {
  string,
};
