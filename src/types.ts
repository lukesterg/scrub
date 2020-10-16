export type TypeOfTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export type ObjectAdditionalFieldType = 'strip' | 'merge' | 'error';

export { ValidationState, ScrubFieldBase, ValidationCallback, ValidationOptions, ValidationResult } from './validator';
import { ScrubFieldBase } from './validator';

interface TypedScrubField<T> extends ScrubFieldBase {}

interface ScrubFieldSchema<T> {
  schema: T;
}

export interface ScrubField<BaseType, Schema> extends TypedScrubField<BaseType>, ScrubFieldSchema<Schema> {}

export type FieldType<T> = T extends TypedScrubField<infer U> ? U : never;
export type ObjectType<T> = { [key in keyof T]: FieldType<T[key]> };
export type SchemaType<T> = T extends ScrubFieldSchema<infer U> ? U : never;
export type ObjectSchemaType<T> = { [key in keyof T]: SchemaType<T[key]> };

export interface StringOptions {
  readonly empty: boolean;
}

export interface NumberOptions {}

export type ObjectOfUserScrubFields = { [key: string]: ScrubFieldBase | ObjectOfUserScrubFields };
export interface ObjectOptions<Fields extends ObjectOfUserScrubFields> {
  readonly additionalFields?: ObjectAdditionalFieldType;
  readonly fields: Fields;
}

export interface ObjectSchema<Fields extends ObjectOfUserScrubFields>
  extends Required<Omit<ObjectOptions<Fields>, 'fields'>> {
  readonly fields: ObjectSchemaType<Fields>;
}
