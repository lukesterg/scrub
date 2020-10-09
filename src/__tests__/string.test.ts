import { types, validate } from '../';
import { allTypes, failedValidation, successfulValidation } from '../testCommon';

describe('type tests', () => {
  test('string is valid', () => {
    const schema = types.string();
    const value = 'a';

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(successfulValidation(value));
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'string');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const schema = types.string();

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
    const schema = types.string({ empty });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(valid ? successfulValidation(value) : failedValidation());
  });
});
