import { fields, validate } from '..';
import { allTypes, failedValidation, successfulValidation } from './common';

describe('type tests', () => {
  test('string is valid', () => {
    const schema = fields.string();
    const value = 'a';

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(successfulValidation(value));
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'string');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const schema = fields.string();

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(failedValidation());
  });
});

describe('required tests', () => {
  const requiredTests: [string, boolean, boolean][] = [
    ['', true, true],
    ['', false, false],
    ['a', true, true],
    ['a', false, true],
  ];
  test.each(requiredTests)('value=%s empty=%s valid=%s', (value, empty, valid) => {
    const schema = fields.string({ empty });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(valid ? successfulValidation(value) : failedValidation());
  });
});

describe('schema test', () => {
  const defaultSettings = {
    empty: false,
  };

  test('default options', () => {
    const schema = fields.string();
    expect(schema.schema).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = fields.string({ empty: true });
    expect(schema.schema).toEqual({ ...defaultSettings, empty: true });
  });
});

describe('length test', () => {
  test('max length cannot be less than min length', () => {
    const action = () => fields.string({ minLength: 2, maxLength: 1 });
    expect(action).toThrow();
  });

  test.each([
    ['', false],
    ['a', true],
    ['ab', true],
    ['abc', true],
    ['abcd', false],
  ])('value=%s min=1 max=3 valid=%s', (value, valid) => {
    const schema = fields.string({ minLength: 1, maxLength: 3, empty: true });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(valid ? successfulValidation(value) : failedValidation());
  });

  test.each([
    ['', false],
    ['a', true],
    ['ab', false],
  ])('value=%s min=1 max=1 valid=%s', (value, valid) => {
    const schema = fields.string({ minLength: 1, maxLength: 1, empty: true });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(valid ? successfulValidation(value) : failedValidation());
  });
});
