import { assert } from '../common';

export type TypeOfTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

export const validateType = (value: any, type: TypeOfTypes) =>
  assert(typeof value === type, `Value must be of type ${type}`);
