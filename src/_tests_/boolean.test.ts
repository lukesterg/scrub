import * as scrub from '..';
import { allTypes, successOrFailure } from './common';

describe('type tests', () => {
  test.each([true, false])('boolean is valid', (expected) => {
    const actual = scrub.boolean().validate(expected);
    expect(actual).toBe(expected);
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'boolean');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const validator = scrub.boolean();
    const perform = () => validator.validate(value);
    expect(perform).toThrow();
  });
});

describe('serialization test', () => {
  const defaultSettings = {
    allowTypes: [],
    empty: false,
  };

  test('default options', () => {
    const schema = scrub.boolean();
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = scrub.boolean({ allowTypes: 'all' });
    expect(schema.serialize()).toEqual({ ...defaultSettings, allowTypes: ['all'] });
  });
});

describe('string conversion', () => {
  const trueValues = ['yes', 'true', '1', 't', 1];
  const falseValues = ['no', 'false', '0', 'f', 0];

  test.each(trueValues.map((i) => [i, true]).concat(falseValues.map((i) => [i, false])))(
    'value=%s expected=%s',
    (value, expected) => {
      const schema = scrub.boolean({ allowTypes: ['all'] });
      successOrFailure(schema, value, true, expected);
    }
  );

  test('invalid string is error', () => {
    const schema = scrub.boolean({ allowTypes: ['all'] });
    successOrFailure(schema, 'invalid', false);
  });
});

describe('empty', () => {
  test.each([undefined, '', null])('value=%s empty=true isValid=true', (value: any) => {
    const actual = scrub.boolean({ empty: true, allowTypes: ['all'] }).validate(value);
    expect(actual).toBe(value === '' ? undefined : value);
  });
});

describe('choices', () => {
  test('empty choice throws', () => {
    const perform = () => scrub.boolean({ choices: [] });
    expect(perform).toThrow();
  });

  const choicesTest: [boolean[], any, boolean][] = [
    [[false], false, true],
    [[true], true, true],
    [[false], true, false],
    [[true], false, false],
    [[true, false], true, true],
    [[true, false], 't', false],
  ];

  test.each(choicesTest)('choices=%s value=%s valid=%s', (choices, value, valid) => {
    const schema = scrub.boolean({ choices, allowTypes: 'string' });
    successOrFailure(schema, value, valid, value);
  });
});
