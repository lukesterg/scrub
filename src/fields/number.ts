import { ScrubField, NumberOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { validateRange, expandRangeBoundary, sanityTestInput, RangeMinMax } from '../validators/range';
import { validateType } from '../validators/validateType';

const defaultNumberOptions: NumberOptions = {};

const buildRange = (schema: NumberOptions): RangeMinMax => ({
  ...(schema.min ? expandRangeBoundary(schema.min, true, true) : {}),
  ...(schema.max ? expandRangeBoundary(schema.max, true, false) : {}),
});

export const number = (options?: Partial<NumberOptions>): ScrubField<number, NumberOptions> => {
  const schema = { ...defaultNumberOptions, ...options };
  const range = buildRange(schema);

  sanityTestInput(range);

  const validate: ValidationCallback = (state: ValidationState) => {
    if (!validateType(state, 'number')) return;

    validateRange(state, {
      ...range,
      value: state.value,
    });
  };

  return { validate, schema };
};
