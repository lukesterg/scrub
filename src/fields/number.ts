import { ScrubField, NumberOptions, TypeOfTypes } from '../types';
import { ValidationCallback, ValidationState } from '../validator';
import { validateRange, expandRangeBoundary, sanityTestInput, RangeMinMax } from '../validators/range';
import { allowedTypeConverter, Conversions } from '../validators/allowedTypeConverter';
import { validateType } from '../validators/validateType';
import { ScrubError } from '../utilities';

const defaultNumberOptions: NumberOptions = {
  allowTypes: [],
};

const buildRange = (schema: NumberOptions): RangeMinMax => ({
  ...(schema.min ? expandRangeBoundary(schema.min, true, true) : {}),
  ...(schema.max ? expandRangeBoundary(schema.max, true, false) : {}),
});

const conversion: Conversions<NumberOptions> = {
  string: (state, options) => {
    let value: string = state.value;
    // remove punctuation (ie: 123, 000).
    value = value.replace(/[^0-9.-]+/g, '');
    const match = (value as string).match(/^(-?\d*)(\.(\d*))?$/);
    if (!state.assert(value === '.' || match !== null, 'Please enter a valid number')) {
      return;
    }

    let [_, whole, _2, fractional] = match;
    if (fractional && options.precision !== undefined) {
      fractional = fractional.slice(0, options.precision);
    }

    let newValue = whole || 0;
    if (fractional && +fractional > 0) {
      newValue += `.${fractional}`;
    }

    const converted = +newValue;

    if (
      state.assert(
        newValue === converted.toString(),
        'String could not be converted to a number, it is either too large or has too many decimal places'
      )
    ) {
      state.setValue(converted);
    }
  },
};

const setNumberPrecision = (value: number, precision: number) => +value.toFixed(precision);

export const number = (options?: Partial<NumberOptions>): ScrubField<number, NumberOptions> => {
  const schema = { ...defaultNumberOptions, ...options };
  const range = buildRange(schema);

  if (schema.precision && schema.precision < 0) {
    throw new ScrubError('precision must be a positive value');
  }

  sanityTestInput(range);
  const performConversion = allowedTypeConverter(schema.allowTypes, 'number', conversion);

  const validate: ValidationCallback = (state: ValidationState) => {
    if (!performConversion(state, schema)) return;
    if (!validateType(state, 'number')) return;

    if (schema.precision !== undefined) {
      setNumberPrecision(state.value, schema.precision);
    }

    validateRange(state, {
      ...range,
      value: state.value,
    });
  };

  return { validate, schema };
};
