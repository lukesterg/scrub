import { assert, copyFilteredObject } from '../common';
import { Allow } from '../validators/allow';
import { DomainTypes, DomainValidationOptions } from '../validators/domain';
import { maximumEmailLength, validateEmail } from '../validators/email';
import { RangeLimitInclusiveOption } from '../validators/range';
import { DomainOptions } from './domain';
import { StringOptions, StringValidator, serializeKeys as stringSerializeKeys } from './string';

export interface EmailOptions<T = string> extends StringOptions<T> {
  allow: DomainValidationOptions;
}

export const serializeKeys = new Set<keyof DomainOptions>([...stringSerializeKeys, 'allow']);

export class EmailValidator<T = string> extends StringValidator<T> implements EmailOptions<T> {
  protected _allow = new Allow<DomainTypes>({ default: 'domain' });

  constructor() {
    super();
    (this as any).serializeKeys = serializeKeys;
  }

  get allow(): DomainValidationOptions {
    return this._allow.allow;
  }

  set allow(value: DomainValidationOptions) {
    this._allow.allow = value;
  }

  get maxLength(): number {
    return (this._range.max as RangeLimitInclusiveOption)?.value || maximumEmailLength;
  }

  protected _validate(value: any): T | undefined {
    value = super._validate(value);
    if (!value || value === '') {
      return value;
    }

    assert(validateEmail(value, this._allow.allow), 'Please enter a valid email');
    return value;
  }
}

export function email(options?: Partial<EmailOptions<string | undefined>>): EmailValidator<string> {
  const string = new EmailValidator();
  if (options) {
    copyFilteredObject(string, options, string.serializeKeys);
  }

  return string;
}
