import { TypedScrubField, StringOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { validateType } from '../validators/validateType';

export const string = (options: StringOptions = {}): TypedScrubField<string> => {
  const validate: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'string')) return;
    state.assert(options?.empty || state.value !== '', 'Please enter a value');
  };

  return { validate };
};
