export type TypeOfTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export type ObjectAdditionalFieldType = 'strip' | 'merge' | 'error';

export { ValidationState, ScrubFieldBase, ValidationCallback, ValidationOptions, ValidationResult } from './validator';
import { ScrubFieldBase } from './validator';
import { DomainValidationOptions } from './validators/domain';

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

export type FieldType<T> = T extends TypedScrubField<infer U> ? U : never;
export type ObjectType<T> = { [key in keyof T]: FieldType<T[key]> };
export type SchemaType<T> = T extends ScrubFieldSchema<infer U> ? U : never;
export type ObjectSchemaType<T> = { [key in keyof T]: SchemaType<T[key]> };
export type AllowedStringTypes = 'number' | 'boolean' | 'bigint' | 'all';

export interface StringOptions extends Partial<MaxLength>, Partial<MinLength> {
  readonly allowTypes: AllowedStringTypes[] | AllowedStringTypes;
  readonly empty: boolean;
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

export interface UserDomainOptions extends DomainValidationOptions {}

export interface DomainOptions extends UserDomainOptions, MaxLength {}
