import * as scrub from '..';
import { allTypes, successOrFailure } from './common';

describe('type tests', () => {
  test('number is valid', () => {
    const expected = 1;
    const actual = scrub.number().validate(expected);
    expect(actual).toBe(expected);
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'number');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const validator = scrub.number();
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
    const schema = scrub.number();
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = scrub.number({ min: 3 });
    expect(schema.serialize()).toEqual({ ...defaultSettings, min: { value: 3, inclusive: true } });
  });
});

describe('length test', () => {
  test.each([
    [1, 0.9, true, true],
    [1, 1, false, true],
    [1, 1, false, false],
  ])('min=%s max=%s minInclusive=%s maxInclusive=%s isValid=false', (min, max, minInclusive, maxInclusive) => {
    const action = () =>
      scrub.number({
        min: { value: min, inclusive: minInclusive },
        max: { value: max, inclusive: maxInclusive },
      });
    expect(action).toThrow();
  });

  test('value=1 min=1 max=1 isValid=true', () => {
    const expected = 1;
    const actual = scrub.number({ min: 1, max: 1 }).validate(expected);
    expect(actual).toBe(expected);
  });

  test.each([
    [0.99, true, false],
    [1, true, true],
    [1.01, true, true],
    [1.99, true, true],
    [2, true, true],
    [2.01, true, false],
    [0.99, false, false],
    [1, false, false],
    [1.01, false, true],
    [1.99, false, true],
    [2, false, false],
    [2.01, false, false],
  ])('value=%s min=1 max=2 inclusive=%s valid=%s', (value, inclusive, valid) => {
    const schema = scrub.number({ min: { value: 1, inclusive }, max: { value: 2, inclusive } });
    successOrFailure(schema, value, valid, value);
  });
});

describe('string conversion', () => {
  test.each([
    ['', undefined],
    ['1', 1],
    ['+1', 1],
    ['123, 000', 123000],
    ['-1', -1],
    ['1.1', 1.1],
    ['-1.1', -1.1],
    ['--1', undefined],
    ['.', undefined],
    ['1.', 1],
    ['0', 0],
    ['1.1.1', undefined],
    ['.1', 0.1],
    ['0.1', 0.1],
    ['-9007199254740992', -9007199254740992],
    ['9007199254740992', 9007199254740992],
    ['-9007199254740993', undefined],
    ['9007199254740993', undefined],
    ['0.1234567890123456', 0.1234567890123456],
    ['0.12345678901234567', undefined],
    ['a', undefined],
  ])('value=%s expected=%s', (value, expected) => {
    const schema = scrub.number({ allowTypes: ['string'] });
    successOrFailure(schema, value, expected !== undefined, expected);
  });

  test.each([
    ['1', 4, 1],
    ['-1', 4, -1],
    ['0.123', 4, 0.123],
    ['0.1234', 4, 0.1234],
    ['0.12345', 4, 0.1234],
    ['0.12345678901234567', 4, 0.1234],
    ['-0.12345678901234567', 4, -0.1234],
  ])('value=%s precision=%s expected=%s', (value, precision, expected) => {
    const schema = scrub.number({ allowTypes: ['string'], precision });
    successOrFailure(schema, value, expected !== undefined, expected);
  });

  test('value= empty=true isValid=true', () => {
    const expected = 1;
    const actual = scrub.number({ allowTypes: ['string'], empty: true }).validate(expected);
    expect(actual).toBe(expected);
  });
});

describe('precision', () => {
  test('negative precision throws', () => {
    const action = () => scrub.number({ allowTypes: ['string'], precision: -1 });
    expect(action).toThrow();
  });

  test.each([
    [1.1, 2, 1.1],
    [1.12, 2, 1.12],
    [1.123, 2, 1.12],
    [-1.1, 2, -1.1],
    [-1.12, 2, -1.12],
    [-1.123, 2, -1.12],
    [1, 0, 1],
    [-1, 0, -1],
    [0, 0, 0],
  ])('value=%s precision=%s expected=%s', (value, precision, expected) => {
    const schema = scrub.number({ precision });
    successOrFailure(schema, value, expected !== undefined, expected);
  });
});

describe('choices', () => {
  test('empty choice throws', () => {
    const perform = () => scrub.number({ choices: [] });
    expect(perform).toThrow();
  });

  const choicesTest: [number[], any, boolean][] = [
    [[1], '1', true],
    [[1], 2, false],
    [[1, 2.1], 1, true],
    [[1, 2.1], 2.1, true],
    [[1, 2.1], 3, false],
  ];

  test.each(choicesTest)('choices=%s value=%s valid=%s', (choices, value, valid) => {
    const schema = scrub.number({ choices, allowTypes: 'string' });
    successOrFailure(schema, value, valid, +value);
  });
});
