import { ValidationField } from './common';

export { ScrubError, ValidatorError, ObjectValidatorError, GetType } from './common';
export { boolean, BooleanOptions, BooleanValidator } from './fields/boolean';
export { string, StringOptions, StringValidator } from './fields/string';
export { object, ObjectOptions, ObjectValidator } from './fields/object';
export { number, NumberOptions, NumberValidator } from './fields/number';
export { domain, DomainOptions, DomainValidator } from './fields/domain';
export { email, EmailOptions, EmailValidator } from './fields/email';
export { password, PasswordOptions, PasswordValidator } from './fields/password';
export { uri, UriOptions, UriValidator } from './fields/uri';
export { RangeLimitInclusiveOption } from './validators/range';

export type Field = ValidationField<unknown, unknown>;
