import { assert, copyFilteredObject, Empty, ScrubError, ValidationField } from '../common';
import { AllowTypeConverter, ConversionCallback, AllowOptions, AllowTypesUserOptions } from '../validators/allow';
import { Choices, ChoicesUserOptions, AllChoiceOptions } from '../validators/choice';
import { MinMaxRangeUserOptions, Range, RangeLimitType } from '../validators/range';
import { validateType } from '../validators/validateType';

type NumberAllowOptions = 'string';

export interface NumberOptions<T = number>
  extends Empty,
    AllowTypesUserOptions<NumberAllowOptions>,
    MinMaxRangeUserOptions,
    ChoicesUserOptions<T> {
  precision?: number;
}

const conversions: ConversionCallback<NumberAllowOptions> = {
  string: function (this: NumberValidator, value: any) {
    if (value === '') {
      assert(this.empty, 'Please enter a value');
      return;
    }

    // remove punctuation (ie: 123, 000).
    value = value.replace(/[^0-9.-]+/g, '');
    const match = (value as string).match(/^(-?\d*)(\.(\d*))?$/);
    assert(value === '.' || match !== null, 'Please enter a valid number');

    let [_, whole, _2, fractional] = match;
    if (fractional && this.precision !== undefined) {
      fractional = fractional.slice(0, this.precision);
    }

    let newValue = whole || 0;
    if (fractional && +fractional > 0) {
      newValue += `.${fractional}`;
    }

    const converted = +newValue;

    assert(
      newValue === converted.toString(),
      'String could not be converted to a number, it is either too large or has too many decimal places'
    );
    return converted;
  },
};
const serializeKeys = new Set<keyof NumberOptions>(['allowTypes', 'choices', 'empty', 'max', 'min', 'precision']);

export class NumberValidator<T = number>
  extends ValidationField<T, Partial<NumberOptions<T>>>
  implements NumberOptions<T> {
  readonly serializeKeys = serializeKeys;

  protected _range = new Range({ minInclusiveDefault: true, maxInclusiveDefault: true, units: '' });
  protected _allowedTypes = new AllowTypeConverter<NumberAllowOptions>({ default: [] });
  protected _choices = new Choices<T>();
  protected _precision?: number;

  empty = false;

  type() {
    return ['number'];
  }

  get min(): RangeLimitType {
    return this._range.min;
  }
  set min(value: RangeLimitType) {
    this._range.min = value;
  }

  get max(): RangeLimitType {
    return this._range.max;
  }

  set max(value: RangeLimitType) {
    this._range.max = value;
  }

  get precision(): number | undefined {
    return this._precision;
  }
  set precision(value: number | undefined) {
    if (value !== undefined && value < 0) {
      throw new ScrubError('precision must be positive');
    }
    this._precision = value;
  }

  get allowTypes(): AllowOptions<NumberAllowOptions> {
    return this._allowedTypes.allow;
  }

  set allowTypes(value: AllowOptions<NumberAllowOptions>) {
    this._allowedTypes.allow = value;
  }

  get choices(): AllChoiceOptions<T> | undefined {
    return this._choices.choices;
  }

  set choices(value: AllChoiceOptions<T> | undefined) {
    this._choices.choices = value;
  }

  protected _validate(value: any): T | undefined {
    value = this._allowedTypes.convert(value, conversions, this);
    if (value === undefined && this.empty) return value;
    validateType(value, 'number');
    this._choices.test(value);

    if (this._precision !== undefined) {
      value = +value.toFixed(this._precision);
    }

    this._range.test(value);
    return value;
  }
}

export function number(): NumberValidator<number>;
export function number(
  options?: Partial<NumberOptions<number | undefined>> & { empty: true }
): NumberValidator<number | undefined>;
export function number(options?: Partial<NumberOptions<number | undefined>>): NumberValidator<number>;
export function number(
  options?: Partial<NumberOptions<number | undefined>>
): NumberValidator<number> | NumberValidator<number | undefined> {
  const number = new NumberValidator();
  if (options) {
    copyFilteredObject(number, options, number.serializeKeys);
  }

  return number;
}
