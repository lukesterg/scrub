import { TypedScrubField, NumberOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { validateType } from '../validators/validateType';

export const number = (options: NumberOptions = {}): TypedScrubField<number> => {
  const validate: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'number')) return;
  };

  return { validate };
};
