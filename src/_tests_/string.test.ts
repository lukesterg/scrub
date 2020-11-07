import { fields } from '..';
import { allTypes, successOrFailure } from './common';

describe('type tests', () => {
  test('string is valid', () => {
    const expected = 'a';
    const actual = fields.string().validate(expected);
    expect(actual).toBe(expected);
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'string');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const validator = fields.string();
    const perform = () => validator.validate(value);
    expect(perform).toThrow();
  });
});

describe('empty tests', () => {
  const requiredTests: [string, boolean, boolean][] = [
    ['', true, true],
    ['', false, false],
    ['a', true, true],
    ['a', false, true],
  ];
  test.each(requiredTests)('value=%s empty=%s valid=%s', (value, empty, valid) => {
    const schema = fields.string({ empty });
    successOrFailure(schema, value, valid, value);
  });
});

describe('serialization test', () => {
  const defaultSettings = {
    empty: false,
    allowTypes: [],
  };

  test('default options', () => {
    const schema = fields.string();
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = fields.string({ empty: true });
    expect(schema.serialize()).toEqual({ ...defaultSettings, empty: true });
  });
});

describe('length test', () => {
  test('max length cannot be less than min length', () => {
    const perform = () => fields.string({ minLength: 2, maxLength: 1 });
    expect(perform).toThrow();
  });

  test.each([
    ['', false],
    ['a', true],
    ['ab', true],
    ['abc', true],
    ['abcd', false],
  ])('value=%s min=1 max=3 valid=%s', (value, valid) => {
    const schema = fields.string({ minLength: 1, maxLength: 3, empty: true });
    successOrFailure(schema, value, valid, value);
  });

  test.each([
    ['', false],
    ['a', true],
    ['ab', false],
  ])('value=%s min=1 max=1 valid=%s', (value, valid) => {
    const schema = fields.string({ minLength: 1, maxLength: 1, empty: true });
    successOrFailure(schema, value, valid, value);
  });
});

describe('type conversion', () => {
  test.each([
    [1, '1'],
    [-1, '-1'],
    [1.1, '1.1'],
    [-1.1, '-1.1'],
    [BigInt(123), '123'],
    [BigInt(-123), '-123'],
    [true, 'true'],
    [false, 'false'],
  ])('value=%s expected=%s', (value, expected) => {
    const schema = fields.string({ allowTypes: 'all' });
    const actual = schema.validate(value);
    expect(actual).toBe(expected);
  });
});

describe('choices', () => {
  test('empty choice throws', () => {
    const perform = () => fields.string({ choices: [] });
    expect(perform).toThrow();
  });

  const choicesTest: [string[], any, boolean][] = [
    [['a'], 'a', true],
    [['a'], 'b', false],
    [['a', '2.1'], 'a', true],
    [['a', '2.1'], 2.1, true],
    [['a', '2.1'], 3, false],
  ];

  test.each(choicesTest)('choices=%s value=%s valid=%s', (choices, value, valid) => {
    const schema = fields.string({ choices, allowTypes: 'all' });
    successOrFailure(schema, value, valid, value.toString());
  });
});
