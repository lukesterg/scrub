import { DomainOptions, ScrubField, UserDomainOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { validateDomain, maximumDomainLength } from '../validators/domain';
import { string } from './string';

const defaultDomainOptions: DomainOptions = {
  allow: ['domain'],
  maxLength: maximumDomainLength,
  empty: false,
};

// Reference: https://en.wikipedia.org/wiki/Domain_Name_System
export const domain = (options?: Partial<UserDomainOptions>): ScrubField<string, DomainOptions> => {
  const schema = { ...defaultDomainOptions, ...options };
  const { validate: stringValidate } = string(options);

  const validate: ValidationCallback = (state: ValidationState) => {
    stringValidate(state);
    if (typeof state.value !== 'string' || state.value === '') {
      return;
    }

    schema.allow;

    state.assert(validateDomain(state.value, schema), 'Please enter a valid domain');
  };

  return { validate, schema };
};
