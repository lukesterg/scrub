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
