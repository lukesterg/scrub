import * as scrub from '..';
import { PasswordOptions } from '../fields/password';
import { successOrFailure } from './common';

describe('password verification tests', () => {
  type PasswordTestEntry = [Partial<PasswordOptions>, string, boolean];
  // prettier-ignore
  const passwordTests: PasswordTestEntry[] = [
    [{ requireLowerCase: true }, 'a', true],
    [{ requireLowerCase: true }, 'A', false],
    [{ requireUpperCase: true }, 'B', true],
    [{ requireUpperCase: true }, 'b', false],
    [{ requireNumber: true }, '0', true],
    [{ requireNumber: true }, 'A', false],
    [{ requireSymbol: true }, '$', true],
    [{ requireSymbol: false }, 'A', true],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, 'aA0%', true],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, 'A0%', false],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, '0%', false],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true }, '%', false],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true, empty: true }, '', false],
    [{}, 'a', true],
    [{ minLength: 2 }, 'a', false],
    [{ requireLowerCase: true, requireUpperCase: true, requireNumber: true, requireSymbol: true, ignoreRequirementsIfLengthIsAtLeast: 2}, 'abc', true]
  ];

  test.each(passwordTests)('options=%s value=%s isValid=%s', (options, value, isValid) => {
    const schema = scrub.password(options);
    successOrFailure(schema, value, isValid, value);
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
    const schema = scrub.password();
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = scrub.password({ ignoreRequirementsIfLengthIsAtLeast: 2 });
    expect(schema.serialize()).toEqual({ ...defaultSettings, ignoreRequirementsIfLengthIsAtLeast: 2 });
  });
});
