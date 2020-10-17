import { ScrubField, StringOptions } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { allowedTypeConverter, Conversions } from '../validators/allowedTypeConverter';
import { RangeMinMax, sanityTestInput, validateRange } from '../validators/range';
import { validateType } from '../validators/validateType';

const defaultStringOptions: StringOptions = {
  empty: false,
  allowTypes: [],
};

const buildRange = (schema: StringOptions): RangeMinMax => ({
  minInclusive: true,
  maxInclusive: true,
  ...(schema.minLength ? { min: schema.minLength } : {}),
  ...(schema.maxLength ? { max: schema.maxLength } : {}),
});

const conversion: Conversions<StringOptions> = {
  number: (state) => state.setValue(state.value.toString()),
  boolean: (state) => state.setValue(state.value.toString()),
  bigint: (state) => state.setValue(state.value.toString()),
};

export const string = (options?: Partial<StringOptions>): ScrubField<string, StringOptions> => {
  const schema = { ...defaultStringOptions, ...options };
  const range = buildRange(schema);

  sanityTestInput(range);
  const performConversion = allowedTypeConverter(schema.allowTypes, 'string', conversion);

  const validate: ValidationCallback = (state: ValidationState) => {
    if (!performConversion(state, schema)) return;
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
