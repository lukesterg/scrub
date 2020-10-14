export type TypeOfTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export type ObjectAdditionalFieldType = 'strip' | 'merge' | 'error';

export { ValidationState, ScrubField, ValidationCallback, ValidationOptions, ValidationResult } from './validator';
import { ScrubField } from './validator';

export interface TypedScrubField<T> extends ScrubField {}
export type FieldType<T> = T extends TypedScrubField<infer U> ? U : never;
export type ObjectType<T> = { [key in keyof T]: FieldType<T[key]> };

export interface StringOptions {
  readonly empty?: boolean;
}

export interface NumberOptions {}

export type ObjectOfUserScrubFields = { [key: string]: ScrubField | ObjectOfUserScrubFields };
export interface ObjectOptions<T extends ObjectOfUserScrubFields> {
  readonly additionalFields?: ObjectAdditionalFieldType;
  readonly fields: T;
}
