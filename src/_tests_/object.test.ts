import { types, validate } from '..';
import { allTypes, failedValidation as failedFieldValidation } from './common';

const successfulValidation = (value: any) => ({
  success: true,
  errors: {},
  value,
});

const failedValidation = (errors: string[]) => ({
  success: false,
  errors: errors.reduce((previous, current) => ({ ...previous, [current]: [expect.any(String)] }), {}),
  value: undefined,
});

const failedValidationRecursive = (errors: any) => ({
  success: false,
  errors: errors,
  value: undefined,
});

describe('type tests', () => {
  test('object is valid', () => {
    const schema = types.object({ fields: {} });
    const value = {};

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(successfulValidation(value));
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'object');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const schema = types.object({ fields: {} });

    const validationResult = validate({ schema, value });

    expect(validationResult).toEqual(failedFieldValidation());
  });
});

describe('fields', () => {
  const successfulTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{}, {}, 'strip', {}],
    [{ a: 'a' }, {}, 'strip', {}],
    [{ a: 'a' }, {}, 'merge', { a: 'a' }],
    [{ a: 'a' }, { a: types.string() }, 'strip', { a: 'a' }],
    [{ a: 'a', b: 'a' }, { a: types.string(), b: types.string() }, 'strip', { a: 'a', b: 'a' }],
  ];

  test.each(successfulTests)(
    'input=%s schema=%s additionalField=%s expected=%s is valid',
    (input, objectSchema, additionalFields, expected) => {
      const schema = types.object({ fields: objectSchema, additionalFields });

      const validationResult = validate({ schema, value: input });

      expect(validationResult).toEqual(successfulValidation(expected));
    }
  );

  const invalidTests: [any, any, ObjectAdditionalFieldType, string[]][] = [
    [{ a: '' }, {}, 'error', ['a']],
    [{ a: '', b: '' }, {}, 'error', ['a', 'b']],
    [{ a: '' }, { a: types.string() }, 'strip', ['a']],
    [{}, { a: types.string() }, 'strip', ['a']],
    [{}, { a: types.string() }, 'merge', ['a']],
    [{ a: '', b: '' }, { a: types.string(), b: types.string() }, 'strip', ['a', 'b']],
  ];
  test.each(invalidTests)(
    'input=%s schema=%s additionalFields=%s errorField=%s is invalid',
    (input, objectSchema, additionalFields, errorFields) => {
      const schema = types.object({ fields: objectSchema, additionalFields });

      const validationResult = validate({ schema, value: input });

      expect(validationResult).toEqual(failedValidation(errorFields));
    }
  );
});

describe('recursion', () => {
  const successfulTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{ a: { b: 'a' } }, { a: { b: types.string() } }, 'strip', { a: { b: 'a' } }],
    [{ a: { b: 'a' } }, { a: {} }, 'strip', { a: {} }],
    [{ a: { b: { c: 'a' } } }, { a: { b: { c: types.string() } } }, 'strip', { a: { b: { c: 'a' } } }],
    [{ a: {} }, {}, 'strip', {}],
  ];

  test.each(successfulTests)(
    'input=%s schema=%s additionalField=%s expected=%s',
    (input, objectSchema, additionalFields, expected) => {
      const schema = types.object({ fields: objectSchema, additionalFields });

      const validationResult = validate({ schema, value: input });

      expect(validationResult).toEqual(successfulValidation(expected));
    }
  );

  const invalidTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{ a: {} }, { a: { b: types.string() } }, 'strip', { a: { b: [expect.any(String)] } }],
    [
      { a: { c: {} } },
      { a: { b: types.string(), c: { d: types.string() } } },
      'strip',
      { a: { c: { d: [expect.any(String)] } } },
    ],
    [{ a: { b: 'a' } }, { a: {} }, 'error', { a: { b: [expect.any(String)] } }],
  ];
  test.each(invalidTests)(
    'input=%s schema=%s additionalFields=%s errorField=%s',
    (input, objectSchema, additionalFields, errorFields) => {
      const schema = types.object({ fields: objectSchema, additionalFields });

      const validationResult = validate({ schema, value: input });

      expect(validationResult).toEqual(failedValidationRecursive(errorFields));
    }
  );
});
