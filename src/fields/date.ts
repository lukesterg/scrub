import { assert, copyFilteredObject, Empty, ScrubError, ValidationField } from '../common';
import { AllowTypeConverter, ConversionCallback, AllowOptions, AllowTypesUserOptions } from '../validators/allow';
import { Choices, ChoicesUserOptions, AllChoiceOptions } from '../validators/choice';
import { MinMaxRangeUserOptions, Range, RangeLimitInclusiveOption, RangeLimitType } from '../validators/range';

type DateAllowOptions = 'string' | 'number';

export interface DateOptions<T = Date>
  extends Empty,
    AllowTypesUserOptions<DateAllowOptions>,
    MinMaxRangeUserOptions<Date>,
    ChoicesUserOptions<T> {
  maxRangeNow?: boolean;
  minRangeNow?: boolean;
}

const conversions: ConversionCallback<DateAllowOptions> = {
  string: function (this: DateValidator, value: any) {
    if (value === '') {
      return;
    }

    return new Date(value);
  },
  number: function (this: DateValidator, value: any) {
    return new Date(value);
  },
};
const serializeKeys = new Set<keyof DateOptions>([
  'allowTypes',
  'choices',
  'empty',
  'min',
  'max',
  'minRangeNow',
  'maxRangeNow',
]);

export class DateValidator<T = Date> extends ValidationField<T, Partial<DateOptions<T>>> implements DateOptions<T> {
  readonly serializeKeys = serializeKeys;

  protected _range = new Range({ minInclusiveDefault: true, maxInclusiveDefault: true, units: '' });
  protected _allowedTypes = new AllowTypeConverter<DateAllowOptions>({ default: [] });
  protected _choices = new Choices<number | undefined>();

  empty = false;
  maxRangeNow?: boolean;
  minRangeNow?: boolean;

  type() {
    return ['date'];
  }

  get min(): RangeLimitType<Date> {
    if (!this._range.min) {
      return;
    }

    return new Date((this._range.min as RangeLimitInclusiveOption).value);
  }

  private _convertDateRangeToNumberRange(value: RangeLimitType<Date>): RangeLimitType {
    if (!value) {
      return;
    }

    if (value instanceof Date) {
      return value.getTime();
    }

    return {
      inclusive: value.inclusive,
      value: value.value.getTime(),
    };
  }

  set min(value: RangeLimitType<Date>) {
    this._range.min = this._convertDateRangeToNumberRange(value);
  }

  get max(): RangeLimitType<Date> {
    if (!this._range.max) {
      return;
    }

    return new Date((this._range.max as RangeLimitInclusiveOption).value);
  }

  set max(value: RangeLimitType<Date>) {
    this._range.max = this._convertDateRangeToNumberRange(value);
  }

  get allowTypes(): AllowOptions<DateAllowOptions> {
    return this._allowedTypes.allow;
  }

  set allowTypes(value: AllowOptions<DateAllowOptions>) {
    this._allowedTypes.allow = value;
  }

  get choices(): AllChoiceOptions<T> | undefined {
    return (this._choices.choices as (number | undefined)[] | undefined)?.map((choice) =>
      typeof choice === 'number' ? new Date(choice) : choice
    ) as any;
  }

  set choices(value: AllChoiceOptions<T> | undefined) {
    const values = Array.isArray(value) ? value : [value];
    const replacedValues = values.map((value) => (value instanceof Date ? value.getTime() : value)) as (
      | number
      | undefined
    )[];
    this._choices.choices = replacedValues;
  }

  protected _validate(value: any): T | undefined {
    value = this._allowedTypes.convert(value, conversions, this);
    if (value === undefined && this.empty) return value;
    assert(value instanceof Date, 'Value must be a date');
    this._choices.test((value as Date).getTime());
    this._range.test((value as Date).getTime());
    assert(this.maxRangeNow !== true || value < new Date(), 'Value cannot be in the future');
    assert(this.minRangeNow !== true || value > new Date(), 'Value cannot be in the past');
    return value;
  }
}

export function date(): DateValidator<Date>;
export function date(
  options?: Partial<DateOptions<Date | undefined>> & { empty: true }
): DateValidator<Date | undefined>;
export function date(options?: Partial<DateOptions<Date | undefined>>): DateValidator<Date>;
export function date(
  options?: Partial<DateOptions<Date | undefined>>
): DateValidator<Date> | DateValidator<Date | undefined> {
  const date = new DateValidator();
  if (options) {
    copyFilteredObject(date, options, date.serializeKeys);
  }

  return date;
}
