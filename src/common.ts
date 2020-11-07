export const fromEntries = <ValueType>(entries: [string, ValueType][]) =>
  entries.reduce((last, [key, value]) => {
    last[key] = value;
    return last;
  }, {} as any) as { [key: string]: ValueType };

export class ScrubError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ScrubError.prototype);
  }
}

export const arrayToCommaListString = (items: any[]) => {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  const copy = [...items];
  const lastItem = copy.pop();
  return `${copy.join(', ')} or ${lastItem}`;
};

export type EmptyMethod = () => void;
export const interceptThrow = (method: EmptyMethod, onThrow: EmptyMethod) => {
  try {
    method();
  } catch (e) {
    onThrow();
    throw e;
  }
};

interface ValidationOptions {
  throwOnFailure: boolean;
}

interface ValidationResult<T> {
  success: boolean;
  result: T | undefined;
  error?: string;
}

export type ErrorKeys<T> = keyof T | '_';
export type ObjectErrorType<T> = { [key in ErrorKeys<T>]?: string };

export class ValidatorError extends ScrubError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidatorError.prototype);
  }
}

export class ObjectValidatorError<T> extends ValidatorError {
  readonly objectError: ObjectErrorType<T>;

  constructor(objectError: ObjectErrorType<T>) {
    super('Object failed to validate');
    Object.setPrototypeOf(this, ObjectValidatorError.prototype);
    this.objectError = objectError;
  }
}

export const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new ValidatorError(message);
  }
};

export const copyFilteredObject = (dest: any, src: any, fields: Set<string>) => {
  Object.keys(src)
    .filter((key) => fields.has(key))
    .forEach((key) => (dest[key] = src[key]));
  return dest;
};

export abstract class ValidationField<Type, SerializeType> {
  abstract readonly serializeKeys: Set<string>;

  protected abstract _validate(value: any): Type | undefined;

  serialize(): SerializeType {
    const result: any = {};
    this.serializeKeys.forEach((key) => {
      const value = (this as any)[key];
      if (value === undefined) {
        return;
      }

      result[key] = value;
    });
    return result;
  }

  validate(value: any, options?: ValidationOptions & { throwOnFailure: true }): Type;
  validate(value: any, options?: ValidationOptions & { throwOnFailure: false }): ValidationResult<Type>;
  validate(value: any): Type;
  validate(value: any, options?: ValidationOptions): ValidationResult<Type> | Type {
    const throwOnFailure = options?.throwOnFailure !== false;

    try {
      const result = this._validate(value) as Type;
      return throwOnFailure ? result : { success: true, result };
    } catch (e) {
      if (!(e instanceof ValidatorError) || throwOnFailure) {
        throw e;
      }

      return {
        result: undefined,
        success: false,
        error: e.message,
      };
    }
  }
}

export const NoValue = Symbol('no-value');

export interface Empty {
  empty: boolean;
}

export interface Undefined {
  undefined: boolean;
}

export type GetType<T> = T extends ValidationField<infer U, infer V> ? U : unknown;
