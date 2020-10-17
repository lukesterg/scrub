import { ScrubField, StringOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { RangeMinMax, sanityTestInput, validateRange } from '../validators/range';
import { validateType } from '../validators/validateType';

const defaultStringOptions: StringOptions = {
  empty: false,
};

const buildRange = (schema: StringOptions): RangeMinMax => ({
  minInclusive: true,
  maxInclusive: true,
  ...(schema.minLength ? { min: schema.minLength } : {}),
  ...(schema.maxLength ? { max: schema.maxLength } : {}),
});

export const string = (options?: Partial<StringOptions>): ScrubField<string, StringOptions> => {
  const schema = { ...defaultStringOptions, ...options };
  const range = buildRange(schema);

  sanityTestInput(range);

  const validate: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'string')) return;
    state.assert(schema.empty || state.value !== '', 'Please enter a value');
    validateRange(state, {
      ...range,
      value: state.value.length,
      units: 'characters',
    });
  };

  return { validate, schema };
};
