import { PasswordOptions } from '../types';
import { fields, validate } from '..';
import { failedValidation, successfulValidation } from './common';

describe('verification tests', () => {
  type PasswordTestEntry = [Partial<PasswordOptions>, string, number];
  // prettier-ignore
  const passwordTests: PasswordTestEntry[] = [
    [{ requireLowerCase: true }, 'a', 0],
    [{ requireLowerCase: true }, 'A', 1],
    [{ requireUpperCase: true }, 'B', 0],
    [{ requireUpperCase: true }, 'b', 1],
    [{ requireNumber: true }, '0', 0],
    [{ requireNumber: true }, 'A', 1],
    [{ requireSymbol: true }, '$', 0],
    [{ requireSymbol: false }, 'A', 0],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, 'aA0%', 0],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, 'A0%', 1],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, '0%', 2],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, '%', 3],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true, empty: true }, '', 4],
    [{}, 'a', 0],
    [{ minLength: 2 }, 'a', 1],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true, ignoreRequirementsIfLengthIsAtLeast: 2}, 'abc', 0]
  ];

  test.each(passwordTests)('options=%s value=%s isValid=%s', (options, value, errors) => {
    const schema = fields.password(options);

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(errors === 0 ? successfulValidation(value) : failedValidation(errors));
  });
});

describe('schema test', () => {
  const defaultSettings: PasswordOptions = {
    empty: false,
    allowTypes: [],
    requireLowerCase: false,
    requireNumber: false,
    requireSymbol: false,
    requireUpperCase: false,
  };

  test('default options', () => {
    const schema = fields.password();
    expect(schema.schema).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = fields.password({ ignoreRequirementsIfLengthIsAtLeast: 2 });
    expect(schema.schema).toEqual({ ...defaultSettings, ignoreRequirementsIfLengthIsAtLeast: 2 });
  });
});
