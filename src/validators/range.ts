import { interceptThrow, ScrubError } from '../utilities';
import { assert } from '../utilities';

interface RangeLimitInclusiveOption {
  value: number;
  inclusive?: boolean;
}

export type RangeLimitType = RangeLimitInclusiveOption | number | undefined;

export interface MinMaxRangeUserOptions {
  min?: RangeLimitType;
  max?: RangeLimitType;
}

export class Range implements MinMaxRangeUserOptions {
  private minInclusiveDefault: boolean;
  private maxInclusiveDefault: boolean;
  private units: string;
  private _min?: RangeLimitInclusiveOption;
  private _max?: RangeLimitInclusiveOption;

  constructor(options: { minInclusiveDefault: boolean; maxInclusiveDefault: boolean; units: string }) {
    this.minInclusiveDefault = options.minInclusiveDefault;
    this.maxInclusiveDefault = options.maxInclusiveDefault;
    this.units = options.units;
  }

  private _convertToValueIncludes(
    value: RangeLimitType,
    defaultInclusive: boolean
  ): RangeLimitInclusiveOption | undefined {
    return typeof value === 'number'
      ? {
          value,
          inclusive: defaultInclusive,
        }
      : value;
  }

  get min(): RangeLimitType {
    return this._min;
  }

  set min(value: RangeLimitType) {
    const currentValue = this._min;
    this._min = this._convertToValueIncludes(value, this.minInclusiveDefault);
    interceptThrow(this._sanityTestInput.bind(this), () => (this._min = currentValue));
  }

  get max(): RangeLimitType {
    return this._max;
  }

  set max(value: RangeLimitType) {
    const currentValue = this._max;
    this._max = this._convertToValueIncludes(value, this.maxInclusiveDefault);
    interceptThrow(this._sanityTestInput.bind(this), () => (this._max = currentValue));
  }

  private _sanityTestInput() {
    if (!this._min?.value || !this._max?.value) {
      return;
    }

    if (this._min.value === this._max.value) {
      if (!this._min.inclusive || !this._max.inclusive) {
        throw new ScrubError('cannot have a range where min and max equal and for one value to not be inclusive');
      }

      return;
    }

    if (this._min.value > this._max.value) {
      throw new ScrubError('a range cannot have a min value larger than the max value');
    }
  }

  test(value: number) {
    const currentValue = ` (currently ${value})`;

    if (this._min && this._max && this._min.value === this._max.value && this._min.inclusive && this._max.inclusive) {
      assert(
        value === this._min.value,
        this.units ? `Please enter ${this._min.value} ${this.units}${currentValue}` : `Please enter ${this._min.value}`
      );
      return;
    }

    if (this._min) {
      if (this._min.inclusive !== false) {
        assert(
          value >= this._min.value,
          this.units
            ? `Please enter at least ${this._min.value} ${this.units}${currentValue}`
            : `Please enter a value that is at least ${this._min.value}${currentValue}`
        );
      } else {
        assert(
          value > this._min.value,
          this.units
            ? `Please enter more than ${this._min.value} ${this.units}${currentValue}`
            : `Please enter a value that is more than ${this._min.value}${currentValue}`
        );
      }
    }

    if (this._max) {
      if (this._max.inclusive !== false) {
        assert(
          value <= this._max.value,
          this.units
            ? `Please enter ${this._max.value} ${this.units} or less${currentValue}`
            : `Please enter a value that is ${this._max.value} or less${currentValue}`
        );
      } else {
        assert(
          value < this._max.value,
          this.units
            ? `Please enter less than ${this._max.value} ${this.units}`
            : `Please enter a value that is less than ${this._max.value}`
        );
      }
    }
  }
}
