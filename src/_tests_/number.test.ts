import { fields, validate } from '..';
import { allTypes, failedValidation, successfulValidation } from './common';

describe('type tests', () => {
  test('number is valid', () => {
    const schema = fields.number();
    const value = 1;

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(successfulValidation(value));
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'number');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const schema = fields.number({ allowTypes: [] });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(failedValidation());
  });
});

describe('schema test', () => {
  const defaultSettings = {
    allowTypes: [],
  };

  test('default options', () => {
    const schema = fields.number();
    expect(schema.schema).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = fields.number({ min: 3 });
    expect(schema.schema).toEqual({ ...defaultSettings, min: 3 });
  });
});

describe('length test', () => {
  test.each([
    [1, 0.9, true, true],
    [1, 1, false, true],
    [1, 1, false, false],
  ])('min=%s max=%s minInclusive=%s maxInclusive=%s isValid=false', (min, max, minInclusive, maxInclusive) => {
    const action = () =>
      fields.number({
        min: { value: min, inclusive: minInclusive },
        max: { value: max, inclusive: maxInclusive },
      });
    expect(action).toThrow();
  });

  test('value=1 min=1 max=1 isValid=true', () => {
    const schema = fields.number({ min: 1, max: 1 });
    const value = 1;

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(successfulValidation(value));
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
    const schema = fields.number({ min: { value: 1, inclusive }, max: { value: 2, inclusive } });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(valid ? successfulValidation(value) : failedValidation());
  });
});

describe('string conversion', () => {
  test.each([
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
    const schema = fields.number({ allowTypes: ['string'] });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(expected !== undefined ? successfulValidation(expected) : failedValidation());
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
    const schema = fields.number({ allowTypes: ['string'], precision });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(expected !== undefined ? successfulValidation(expected) : failedValidation());
  });
});

describe('precision', () => {
  test('negative precision throws', () => {
    const action = () => fields.number({ allowTypes: ['string'], precision: -1 });
    expect(action).toThrow();
  });

  test.each([
    [1.1, 2, 1.1],
    [1.12, 2, 1.12],
    [1.123, 2, 1.123],
    [-1.1, 2, -1.1],
    [-1.12, 2, -1.12],
    [-1.123, 2, -1.123],
    [1, 0, 1],
    [-1, 0, -1],
    [0, 0, 0],
  ])('value=%s precision=%s expected=%s', (value, precision, expected) => {
    const schema = fields.number({ allowTypes: ['string'], precision });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(expected !== undefined ? successfulValidation(expected) : failedValidation());
  });
});

describe('choices', () => {
  test('empty choice throws', () => {
    const perform = () => fields.number({ choices: [] });
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
    const schema = fields.number({ choices, allowTypes: 'string' });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(valid ? successfulValidation(+value) : failedValidation());
  });
});
