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

interface StringOptions {
  readonly empty?: boolean;
}

type ValidationCallback = (validate: ValidationState) => void;

const string = (options: StringOptions = {}) => {
  const result: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'string')) return;
    state.assert(options?.empty || state.value !== '', 'Please enter a value');
  };

  return result;
};

interface ObjectOptions<T = any> {
  readonly additionalFields?: ObjectAdditionalFieldType;
  readonly fields: T;
}

const fromEntries = <ValueType>(entries: [string, ValueType][]) =>
  entries.reduce((last, [key, value]) => {
    last[key] = value;
    return last;
  }, {} as any) as { [key: string]: ValueType };

const wrapInnerObjectFieldsWithValidator = <T>(options: ObjectOptions<T>): ObjectOptions<T> => {
  const entries = Object.entries(options.fields);
  const objectEntries = entries.filter(([_, schema]) => typeof schema === 'object');
  if (objectEntries.length === 0) {
    return options;
  }

  objectEntries.forEach((entry) => {
    entry[1] = object({ ...options, fields: entry[1] });
  });

  return { ...options, fields: fromEntries(objectEntries) as T };
};

export const object = <T>(options: ObjectOptions<T>) => {
  options = wrapInnerObjectFieldsWithValidator(options);
  const result: ValidationCallback = (state: ValidationState<ObjectOptions>) => {
    if (!validateType(state, 'object')) return;

    let success = true;
    let finalValue: any = options.additionalFields === 'merge' ? state.value : {};
    const errors: any = {};

    for (const field in options.fields) {
      if (!(field in state.value)) {
        success = false;
        errors[field] = [`Please add the field ${field}`];
        finalValue = undefined;
        continue;
      }

      const validationResult = validate({ schema: options.fields[field], value: state.value[field] });
      if (!validationResult.success) {
        success = false;
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
        .filter((field) => !(options.fields as any)[field])
        .forEach((field) => (errors[field] = ['Please remove field']));
    }

    state.setValue(finalValue);
    state.setObjectErrors(errors);
  };

  return result;
};

export interface ValidationOptions<SchemaType> {
  readonly schema: SchemaType;
  readonly value: any;
}

export interface ValidationResult<ValueType> {
  readonly success: boolean;
  readonly errors: ErrorType;
  readonly value: ValueType | undefined;
}

export const validate = <T>(options: Readonly<ValidationOptions<T>>): ValidationResult<T> => {
  const state = new ValidationState(options.value, options.schema);
  ((options.schema as any) as ValidationCallback)(state);

  const success = (Array.isArray(state.errors) ? state.errors.length : Object.keys(state.errors).length) === 0;

  return {
    success,
    errors: state.errors,
    value: success ? state.value : undefined,
  };
};

export const types = {
  string: (string as any) as (options?: Partial<StringOptions>) => string,
  object: (object as any) as <T>(options?: Partial<ObjectOptions<T>>) => T,
};
