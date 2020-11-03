export * as fields from './fields';
import { ValidationField } from './utilities';

export type GetType<T> = T extends ValidationField<infer U> ? U : unknown;

export { ScrubError, ValidatorError } from './utilities';
