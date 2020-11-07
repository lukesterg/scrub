import { assert, copyFilteredObject, Empty, ValidationField } from '../common';
import { AllowTypeConverter, ConversionCallback, AllowOptions, AllowTypesUserOptions } from '../validators/allow';
import { Choices, ChoicesUserOptions, AllChoiceOptions } from '../validators/choice';
import { Range, MinMaxLengthRangeUserOptions, RangeLimitInclusiveOption } from '../validators/range';
import { validateType } from '../validators/validateType';

type StringAllowOptions = 'number' | 'boolean' | 'bigint';

export interface StringOptions<T = number>
  extends Empty,
    AllowTypesUserOptions<StringAllowOptions>,
    MinMaxLengthRangeUserOptions,
    Partial<ChoicesUserOptions<T>> {}

const conversions: ConversionCallback<StringAllowOptions> = {
  number: function (this: StringValidator, value: any) {
    return value.toString();
  },
  boolean: function (this: StringValidator, value: any) {
    return value.toString();
  },
  bigint: function (this: StringValidator, value: any) {
    return value.toString();
  },
};

export const serializeKeys = new Set<keyof StringOptions>(['allowTypes', 'choices', 'empty', 'maxLength', 'minLength']);

export class StringValidator<T = string>
  extends ValidationField<T, Partial<StringOptions<T>>>
  implements StringOptions<T> {
  readonly serializeKeys = serializeKeys;

  protected _range = new Range({ minInclusiveDefault: true, maxInclusiveDefault: true, units: '' });
  protected _allowedTypes = new AllowTypeConverter<StringAllowOptions>({ default: [] });
  protected _choices = new Choices<T>();

  empty = false;

  get minLength(): number {
    return (this._range.min as RangeLimitInclusiveOption)?.value;
  }
  set minLength(value: number) {
    this._range.min = value;
  }

  get maxLength(): number {
    return (this._range.max as RangeLimitInclusiveOption)?.value;
  }

  set maxLength(value: number) {
    this._range.max = value;
  }

  get allowTypes(): AllowOptions<StringAllowOptions> {
    return this._allowedTypes.allow;
  }

  set allowTypes(value: AllowOptions<StringAllowOptions>) {
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
    validateType(value, 'string');
    this._choices.test(value);
    assert(this.empty || value !== '', 'Please enter a value');
    this._range.test(value.length);
    return value;
  }
}

export function string(options?: Partial<StringOptions<string | undefined>>): StringValidator<string> {
  const string = new StringValidator();
  if (options) {
    copyFilteredObject(string, options, string.serializeKeys);
  }

  return string;
}
