import { Allow } from '../validators/allow';
import { RangeLimitInclusiveOption } from '../validators/range';
import { DomainValidationOptions, DomainTypes, maximumDomainLength, validateDomain } from '../validators/domain';
import { StringValidator, StringOptions, serializeKeys as stringSerializeKeys } from './string';
import { assert, copyFilteredObject } from '../common';

export interface PasswordOptions<T = string> extends StringOptions<T> {
  requireLowerCase: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
  requireUpperCase: boolean;
  ignoreRequirementsIfLengthIsAtLeast?: number;
}

export const serializeKeys = new Set<keyof PasswordOptions>([
  ...stringSerializeKeys,
  'requireLowerCase',
  'requireNumber',
  'requireSymbol',
  'requireUpperCase',
  'ignoreRequirementsIfLengthIsAtLeast',
]);

export class PasswordValidator<T = string> extends StringValidator<T> implements PasswordOptions<T> {
  requireLowerCase = false;
  requireNumber = false;
  requireSymbol = false;
  requireUpperCase = false;
  ignoreRequirementsIfLengthIsAtLeast?: number;

  constructor() {
    super();
    (this as any).serializeKeys = serializeKeys;
  }

  type() {
    return super.type().concat(['password']);
  }

  protected _validate(value: any): T | undefined {
    value = super._validate(value);
    if (!value || value === '') {
      return value;
    }

    if (
      this.ignoreRequirementsIfLengthIsAtLeast !== undefined &&
      value.length >= this.ignoreRequirementsIfLengthIsAtLeast
    ) {
      return value;
    }

    const alternative =
      this.ignoreRequirementsIfLengthIsAtLeast !== undefined
        ? ` or make your password at least ${this.ignoreRequirementsIfLengthIsAtLeast}`
        : '';
    assert(
      this.requireUpperCase !== true || /[A-Z]/.test(value),
      `Please enter a capital letter (such as A)${alternative}`
    );
    assert(
      this.requireLowerCase !== true || /[a-z]/.test(value),
      `Please enter a lower case letter (such as a)${alternative}`
    );
    assert(this.requireNumber !== true || /[0-9]/.test(value), `Please enter a number (such as 0)${alternative}`);
    assert(
      this.requireSymbol !== true || /[`~!@#$%^&*()+=:;'"<>/?_-]/.test(value),
      `Please enter a symbol (such as #)${alternative}`
    );

    return value;
  }
}

export function password(options?: Partial<PasswordOptions<string | undefined>>): PasswordValidator<string> {
  const password = new PasswordValidator();
  if (options) {
    copyFilteredObject(password, options, password.serializeKeys);
  }

  return password;
}
