import { ScrubField, StringOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { validateType } from '../validators/validateType';

const defaultStringOptions: StringOptions = {
  empty: false,
};

export const string = (options?: Partial<StringOptions>): ScrubField<string, StringOptions> => {
  const schema = { ...defaultStringOptions, ...options };

  const validate: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'string')) return;
    state.assert(schema.empty || state.value !== '', 'Please enter a value');
  };

  return { validate, schema };
};
