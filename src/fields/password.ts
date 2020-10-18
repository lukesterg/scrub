import { PasswordOptions, ScrubField } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { string } from './string';

const defaultPasswordOptions: PasswordOptions = {
  empty: false,
  requireLowerCase: false,
  requireNumber: false,
  requireSymbol: false,
  requireUpperCase: false,
  allowTypes: [],
};

export const password = (options?: Partial<PasswordOptions>): ScrubField<string, PasswordOptions> => {
  const { validate: stringValidate, schema } = string({
    ...defaultPasswordOptions,
    ...options,
  });

  const validate: ValidationCallback = (state: ValidationState) => {
    stringValidate(state);
    if (typeof state.value !== 'string') {
      return;
    }

    if (
      schema.ignoreRequirementsIfLengthIsAtLeast !== undefined &&
      state.value.length >= schema.ignoreRequirementsIfLengthIsAtLeast
    ) {
      return;
    }

    const alternative =
      schema.ignoreRequirementsIfLengthIsAtLeast !== undefined
        ? ` or make your password at least ${schema.ignoreRequirementsIfLengthIsAtLeast}`
        : '';
    state.assert(
      schema.requireUpperCase !== true || /[A-Z]/.test(state.value),
      `Please enter a capital letter (such as A)${alternative}`
    );
    state.assert(
      schema.requireLowerCase !== true || /[a-z]/.test(state.value),
      `Please enter a lower case letter (such as a)${alternative}`
    );
    state.assert(
      schema.requireNumber !== true || /[0-9]/.test(state.value),
      `Please enter a number (such as 0)${alternative}`
    );
    state.assert(
      schema.requireSymbol !== true || /[`~!@#$%^&*()+=:;'"<>/?_-]/.test(state.value),
      `Please enter a symbol (such as #)${alternative}`
    );
  };

  return { validate, schema };
};
