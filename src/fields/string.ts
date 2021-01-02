import { assert, copyFilteredObject, Empty, ValidationField, countIfTrue, ScrubError } from '../common';
import { AllowTypeConverter, ConversionCallback, AllowOptions, AllowTypesUserOptions } from '../validators/allow';
import { Choices, ChoicesUserOptions, AllChoiceOptions } from '../validators/choice';
import { Range, MinMaxLengthRangeUserOptions, RangeLimitInclusiveOption } from '../validators/range';
import { validateType } from '../validators/validateType';

export type StringAllowOptions = 'number' | 'boolean' | 'bigint';

export type TransformStringOptions =
  | 'upperCase'
  | 'lowerCase'
  | 'title'
  | 'upperCaseFirst'
  | 'trimStart'
  | 'trimEnd'
  | 'trim';
export type TransformStringType = TransformStringOptions | TransformStringOptions[];

export interface StringOptions<T = string>
  extends Empty,
    AllowTypesUserOptions<StringAllowOptions>,
    MinMaxLengthRangeUserOptions,
    Partial<ChoicesUserOptions<T>> {
  transformString?: TransformStringType;
}

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

export const serializeKeys = new Set<keyof StringOptions>([
  'allowTypes',
  'choices',
  'empty',
  'maxLength',
  'minLength',
  'transformString',
]);

export class StringValidator<T = string>
  extends ValidationField<T, Partial<StringOptions<T>>>
  implements StringOptions<T> {
  readonly serializeKeys = serializeKeys;

  protected _range = new Range({ minInclusiveDefault: true, maxInclusiveDefault: true, units: '' });
  protected _allowedTypes = new AllowTypeConverter<StringAllowOptions>({ default: [] });
  protected _choices = new Choices<T>();
  protected _transformString?: Set<TransformStringOptions>;

  empty = false;

  type() {
    return ['string'];
  }

  get transformString(): TransformStringType | undefined {
    return this._transformString ? [...this._transformString] : undefined;
  }

  set transformString(value: TransformStringType | undefined) {
    if (value === undefined) {
      this._transformString = value;
      return;
    }

    const newTransformString = new Set(Array.isArray(value) ? value : [value]);

    const numberOfCaseChangingOperations = countIfTrue(
      newTransformString.has('lowerCase'),
      newTransformString.has('upperCase'),
      newTransformString.has('title'),
      newTransformString.has('upperCaseFirst')
    );
    if (numberOfCaseChangingOperations > 1) {
      throw new ScrubError('Up to one case changing operation can be set');
    }

    this._transformString = newTransformString;
  }

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

  private _performTransformString(value: string) {
    if (this._transformString === undefined) {
      return value;
    }

    if (this._transformString.has('trim') || this._transformString.has('trimStart')) {
      value = value.trimStart();
    }

    if (this._transformString.has('trim') || this._transformString.has('trimEnd')) {
      value = value.trimEnd();
    }

    if (this._transformString.has('upperCase')) {
      value = value.toUpperCase();
    } else if (this._transformString.has('lowerCase')) {
      value = value.toLowerCase();
    } else if (this._transformString.has('title')) {
      value = value.replace(/\b(\w)/g, (match) => match.toUpperCase());
    } else if (this._transformString.has('upperCaseFirst')) {
      value = value.replace(/\b(\w)/, (match) => match.toUpperCase());
    }

    return value;
  }

  protected _validate(value: any): T | undefined {
    value = this._allowedTypes.convert(value, conversions, this);
    validateType(value, 'string');
    value = this._performTransformString(value);

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
