import { ValidationState } from '../validator';
import { RangeBoundary } from '../types';
import { ScrubError } from '../utilities';

interface MinOptions {
  min?: number;
  minInclusive?: boolean;
}

interface MaxOptions {
  max?: number;
  maxInclusive?: boolean;
}

export type RangeMinMax = MinOptions & MaxOptions;

export interface MinMaxOptions extends RangeMinMax {
  value: number;
  units?: string;
}

export const sanityTestInput = (options: RangeMinMax) => {
  if (!options.min || !options.max) {
    return;
  }

  if (options.min === options.max) {
    if (!options.maxInclusive || !options.minInclusive) {
      throw new ScrubError('cannot have a range where min and max equal and for one value to not be inclusive');
    }

    return;
  }

  if (options.min > options.max) {
    throw new ScrubError('a range cannot have a min value larger than the max value');
  }
};

export function expandRangeBoundary(value: RangeBoundary, inclusiveDefault: boolean, isMin: false): MaxOptions;
export function expandRangeBoundary(value: RangeBoundary, inclusiveDefault: boolean, isMin: true): MinOptions;
export function expandRangeBoundary(
  boundary: RangeBoundary,
  inclusiveDefault: boolean,
  isMin: boolean
): MinOptions | MaxOptions {
  let isInclusive = typeof boundary === 'object' ? boundary.inclusive : inclusiveDefault;
  let value = typeof boundary === 'object' ? boundary.value : boundary;
  return isMin
    ? ({ min: value, minInclusive: isInclusive } as MinOptions)
    : ({ max: value, maxInclusive: isInclusive } as MaxOptions);
}

export const validateRange = (validate: ValidationState, options: MinMaxOptions) => {
  const { value, min, minInclusive, max, maxInclusive, units } = options;
  const currentValue = ` (currently ${value})`;

  if (min && max && min === max && minInclusive && maxInclusive) {
    validate.assert(value === min, units ? `Please enter ${min} ${units}${currentValue}` : `Please enter ${min}`);
    return;
  }

  if (min) {
    if (minInclusive !== false) {
      validate.assert(
        value >= min,
        units
          ? `Please enter at least ${min} ${units}${currentValue}`
          : `Please enter a value that is at least ${min}${currentValue}`
      );
    } else {
      validate.assert(
        value > min,
        units
          ? `Please enter more than ${min} ${units}${currentValue}`
          : `Please enter a value that is more than ${min}${currentValue}`
      );
    }
  }

  if (max) {
    if (maxInclusive !== false) {
      validate.assert(
        value <= max,
        units
          ? `Please enter ${max} ${units} or less${currentValue}`
          : `Please enter a value that is ${max} or less${currentValue}`
      );
    } else {
      validate.assert(
        value < max,
        units ? `Please enter less than ${max} ${units}` : `Please enter a value that is less than ${max}`
      );
    }
  }
};
