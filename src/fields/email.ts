import { assert, copyFilteredObject } from '../common';
import { maximumEmailLength, validateEmail } from '../validators/email';
import { RangeLimitInclusiveOption } from '../validators/range';
import { DomainOptions, DomainValidator, DomainValidatorOptionsBase } from './domain';

export type EmailOptions<T = string> = DomainOptions<T>;

export class EmailValidator<T = string> extends DomainValidatorOptionsBase<T> implements EmailOptions<T> {
  type() {
    return super.type().concat(['email']);
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
  const email = new EmailValidator();
  if (options) {
    copyFilteredObject(email, options, email.serializeKeys);
  }

  return email;
}
