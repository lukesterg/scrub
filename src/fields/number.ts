import { ScrubField, NumberOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { validateType } from '../validators/validateType';

const defaultNumberOptions: NumberOptions = {};

export const number = (options?: Partial<NumberOptions>): ScrubField<number, NumberOptions> => {
  const schema = { ...defaultNumberOptions, options };

  const validate: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'number')) return;
  };

  return { validate, schema };
};
