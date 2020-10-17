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
    const schema = fields.number();

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(failedValidation());
  });
});

describe('schema test', () => {
  const defaultSettings = {};

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
