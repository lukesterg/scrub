export type TypeOfTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export type ObjectAdditionalFieldType = 'strip' | 'merge' | 'error';

export { ValidationState, ScrubFieldBase, ValidationCallback, ValidationOptions, ValidationResult } from './validator';
import { ScrubFieldBase } from './validator';
import { DomainValidationOptions } from './validators/domain';
import { EmailValidationOptions } from './validators/email';

interface TypedScrubField<T> extends ScrubFieldBase {}

interface ScrubFieldSchema<T> {
  schema: T;
}

interface MaxLength {
  maxLength: number;
}

interface MinLength {
  minLength: number;
}

export interface ScrubField<BaseType, Schema> extends TypedScrubField<BaseType>, ScrubFieldSchema<Schema> {}

export type Merge<Destination, Override> = Omit<Destination, keyof Override> & Override;
export type FieldType<T> = T extends TypedScrubField<infer U> ? U : never;
export type ObjectType<T> = { [key in keyof T]: FieldType<T[key]> };
export type SchemaType<T> = T extends ScrubFieldSchema<infer U> ? U : never;
export type ObjectSchemaType<T> = { [key in keyof T]: SchemaType<T[key]> };
export type AllowedStringTypes = 'number' | 'boolean' | 'bigint' | 'all';

interface Empty {
  readonly empty: boolean;
}

export interface StringOptions extends Partial<MaxLength>, Partial<MinLength>, Empty {
  readonly allowTypes: AllowedStringTypes[] | AllowedStringTypes;
}

export type RangeBoundary = number | { value: number; inclusive: boolean };
export type AllowedNumberTypes = 'string' | 'all';

export interface NumberOptions {
  allowTypes: AllowedNumberTypes[] | AllowedNumberTypes;
  precision?: number;
  min?: RangeBoundary;
  max?: RangeBoundary;
}

export type ObjectOfUserScrubFields = { [key: string]: ScrubFieldBase | ObjectOfUserScrubFields };
export interface ObjectOptions<Fields extends ObjectOfUserScrubFields> {
  readonly additionalFields?: ObjectAdditionalFieldType;
  readonly fields: Fields;
}

export interface ObjectSchema<Fields extends ObjectOfUserScrubFields>
  extends Required<Omit<ObjectOptions<Fields>, 'fields'>> {
  readonly fields: ObjectSchemaType<Fields>;
}

export interface UserDomainOptions extends DomainValidationOptions, Empty {}

export interface DomainOptions extends UserDomainOptions, MaxLength {}

export interface UserEmailOptions extends EmailValidationOptions, Empty {}

export interface EmailOptions extends UserEmailOptions, MaxLength {}

export interface PasswordOptions extends StringOptions {
  requireUpperCase: boolean;
  requireLowerCase: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
  ignoreRequirementsIfLengthIsAtLeast?: number;
}
