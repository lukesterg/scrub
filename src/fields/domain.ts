import { Allow } from '../validators/allow';
import { RangeLimitInclusiveOption } from '../validators/range';
import { DomainValidationOptions, DomainTypes, maximumDomainLength, validateDomain } from '../validators/domain';
import { StringValidator, StringOptions, serializeKeys as stringSerializeKeys } from './string';
import { assert, copyFilteredObject } from '../common';

export interface DomainOptions<T = string> extends StringOptions<T> {
  allow: DomainValidationOptions;
}

export const serializeKeys = new Set<keyof DomainOptions>([...stringSerializeKeys, 'allow']);

export class DomainValidator<T = string> extends StringValidator<T> implements DomainOptions<T> {
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
    return (this._range.max as RangeLimitInclusiveOption)?.value || maximumDomainLength;
  }

  protected _validate(value: any): T | undefined {
    value = super._validate(value);
    if (!value || value === '') {
      return value;
    }

    assert(validateDomain(value, this._allow.allow), 'Please enter a valid domain');
    return value;
  }
}

export function domain(options?: Partial<DomainOptions<string | undefined>>): DomainValidator<string> {
  const string = new DomainValidator();
  if (options) {
    copyFilteredObject(string, options, string.serializeKeys);
  }

  return string;
}
