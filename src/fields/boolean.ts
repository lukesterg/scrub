import { assert, copyFilteredObject, Empty, ValidationField } from '../common';
import { AllowOptions, AllowTypeConverter, AllowTypesUserOptions, ConversionCallback } from '../validators/allow';
import { Choices, ChoicesUserOptions, AllChoiceOptions } from '../validators/choice';
import { validateType } from '../validators/validateType';

type BooleanAllowOptions = 'string' | 'number';

export interface BooleanOptions<T = number>
  extends Empty,
    AllowTypesUserOptions<BooleanAllowOptions>,
    ChoicesUserOptions<T> {}

const serializeKeys = new Set<keyof BooleanOptions>(['allowTypes', 'choices', 'empty']);

const trueValues = new Set(['yes', 'true', '1', 't']);
const falseValues = new Set(['no', 'false', '0', 'f']);
const conversions: ConversionCallback<BooleanAllowOptions> = {
  string: function (this: BooleanValidator, value: string) {
    const normalizedValue = value.toLowerCase();
    if (this.empty && value === '') {
      return;
    }

    if (trueValues.has(normalizedValue)) {
      return true;
    }

    if (falseValues.has(normalizedValue)) {
      return false;
    }

    assert(false, 'please enter a value');
  },

  number: function (this: BooleanValidator, value: number) {
    return value !== 0;
  },
};

export class BooleanValidator<T = boolean>
  extends ValidationField<T, Partial<BooleanOptions<T>>>
  implements BooleanOptions<T> {
  readonly serializeKeys = serializeKeys;

  protected _choices = new Choices<T>();
  protected _allowedTypes = new AllowTypeConverter<BooleanAllowOptions>({ default: [] });
  empty = false;

  type() {
    return ['boolean'];
  }

  get allowTypes(): AllowOptions<BooleanAllowOptions> {
    return this._allowedTypes.allow;
  }

  set allowTypes(value: AllowOptions<BooleanAllowOptions>) {
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
    if ((value === undefined || value === null) && this.empty) return value;
    validateType(value, 'boolean');
    this._choices.test(value);
    return value;
  }
}

export function boolean(): BooleanValidator<boolean>;
export function boolean(
  options?: Partial<BooleanOptions<boolean | undefined>> & { empty: true }
): BooleanValidator<boolean | undefined>;
export function boolean(options?: Partial<BooleanOptions<boolean | undefined>>): BooleanValidator<boolean>;
export function boolean(
  options?: Partial<BooleanOptions<boolean | undefined>>
): BooleanValidator<boolean> | BooleanValidator<boolean | undefined> {
  const boolean = new BooleanValidator();
  if (options) {
    copyFilteredObject(boolean, options, boolean.serializeKeys);
  }

  return boolean;
}
