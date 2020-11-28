import { assert, copyFilteredObject } from '../common';
import { DomainOptions, DomainValidatorOptionsBase, serializeKeys as domainSerializeKeys } from './domain';
import { validateUri } from '../validators/uri';

export interface UriOptions<T = string> extends DomainOptions<T> {
  allowedProtocols?: string[];
}

export const serializeKeys = new Set<keyof UriOptions>([...domainSerializeKeys, 'allowedProtocols']);

export class UriValidator<T = string> extends DomainValidatorOptionsBase<T> implements UriOptions<T> {
  allowedProtocols?: string[];

  constructor() {
    super();
    (this as any).serializeKeys = serializeKeys;
    this.allow = 'all';
  }

  protected _validate(value: any): T | undefined {
    value = super._validate(value);
    if (!value || value === '') {
      return value;
    }

    assert(
      validateUri(value, { allow: this._allow.allow, allowedProtocols: this.allowedProtocols }),
      'Please enter a valid URI'
    );
    return value;
  }
}

export function uri(options?: Partial<UriOptions<string | undefined>>): UriValidator<string> {
  const uri = new UriValidator();
  if (options) {
    copyFilteredObject(uri, options, uri.serializeKeys);
  }

  return uri;
}
