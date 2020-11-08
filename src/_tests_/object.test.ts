import * as scrub from '..';
import { allTypes, successOrFailure } from './common';
import { ObjectAdditionalFieldType } from '../fields/object';
import { GetType } from '../common';

describe('type tests', () => {
  test('object is valid', () => {
    const expected = {};
    const actual = scrub.object({ fields: {} }).validate(expected);
    expect(actual).toEqual(expected);
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'object');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const validator = scrub.object({ fields: {} });
    const perform = () => validator.validate(value);
    expect(perform).toThrow();
  });
});

describe('fields', () => {
  const successfulTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{}, {}, 'strip', {}],
    [{ a: 'a' }, {}, 'strip', {}],
    [{ a: 'a' }, {}, 'merge', { a: 'a' }],
    [{ a: 'a' }, { a: scrub.string() }, 'strip', { a: 'a' }],
    [{ a: 'a', b: 'a' }, { a: scrub.string(), b: scrub.string() }, 'strip', { a: 'a', b: 'a' }],
  ];

  test.each(successfulTests)(
    'input=%s schema=%s additionalField=%s expected=%s is valid',
    (input, objectSchema, additionalFields, expected) => {
      const schema = scrub.object({ fields: objectSchema, additionalFields });
      successOrFailure(schema, input, true, expected);
    }
  );

  const invalidTests: [any, any, ObjectAdditionalFieldType, string[]][] = [
    [{ a: '' }, {}, 'error', ['a']],
    [{ a: '', b: '' }, {}, 'error', ['a', 'b']],
    [{ a: '' }, { a: scrub.string() }, 'strip', ['a']],
    [{}, { a: scrub.string() }, 'strip', ['a']],
    [{}, { a: scrub.string() }, 'merge', ['a']],
    [{ a: '', b: '' }, { a: scrub.string(), b: scrub.string() }, 'strip', ['a', 'b']],
  ];
  test.each(invalidTests)(
    'input=%s schema=%s additionalFields=%s errorField=%s is invalid',
    (input, objectSchema, additionalFields, errorFields) => {
      const schema = scrub.object({ fields: objectSchema, additionalFields });
      successOrFailure(schema, input, false, undefined, errorFields);
    }
  );
});

describe('recursion', () => {
  const successfulTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{ a: { b: 'a' } }, { a: { b: scrub.string() } }, 'strip', { a: { b: 'a' } }],
    [{ a: { b: 'a' } }, { a: {} }, 'strip', { a: {} }],
    [{ a: { b: { c: 'a' } } }, { a: { b: { c: scrub.string() } } }, 'strip', { a: { b: { c: 'a' } } }],
    [{ a: {} }, {}, 'strip', {}],
  ];

  test.each(successfulTests)(
    'input=%s schema=%s additionalField=%s expected=%s',
    (input, objectSchema, additionalFields, expected) => {
      const schema = scrub.object({ fields: objectSchema, additionalFields });
      successOrFailure(schema, input, true, expected);
    }
  );

  const invalidTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{ a: {} }, { a: { b: scrub.string() } }, 'strip', { a: { b: expect.any(String) } }],
    [
      { a: { c: {} } },
      { a: { b: scrub.string(), c: { d: scrub.string() } } },
      'strip',
      { a: { b: expect.any(String), c: { d: expect.any(String) } } },
    ],
    [{ a: { b: 'a' } }, { a: {} }, 'error', { a: { b: expect.any(String) } }],
  ];
  test.each(invalidTests)(
    'input=%s schema=%s additionalFields=%s errorField=%s',
    (input, objectSchema, additionalFields, errorFields) => {
      const schema = scrub.object({ fields: objectSchema, additionalFields });
      successOrFailure(schema, input, false, undefined, errorFields);
    }
  );
});

describe('schema test', () => {
  const defaultSettings = {
    fields: {},
    additionalFields: 'strip',
  };

  test('default options', () => {
    const schema = scrub.object({ fields: {} });
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = scrub.object({ fields: {}, additionalFields: 'error' });
    expect(schema.serialize()).toEqual({ ...defaultSettings, additionalFields: 'error' });
  });

  test('inner fields schemas are exposed', () => {
    const schema = scrub.object({ fields: { a: scrub.object({ fields: {} }) } });
    expect(schema.serialize()).toEqual({ ...defaultSettings, fields: { a: defaultSettings } });
  });

  test('nested object schemas are exposed', () => {
    const schema = scrub.object({ fields: { a: scrub.object({ fields: { b: scrub.object({ fields: {} }) } }) } });

    expect(schema.serialize()).toEqual({
      ...defaultSettings,
      fields: { a: { ...defaultSettings, fields: { b: defaultSettings } } },
    });
  });
});

test.only('custom validation', () => {
  const personValidator = scrub.object({
    fields: {
      name: scrub.string({ transformString: ['trim', 'title'] }),
      age: scrub.number({ allowTypes: ['string'] }),
      guardian: scrub.string({ transformString: ['trim', 'title'], empty: true }),
    },
    customValidation: (state) => {
      if (state.cleanedFields.age !== undefined && state.cleanedFields.age < 18 && state.cleanedFields.guardian === '') {
        state.addError('Parent or guardian name is required if the person is under 18 years of age', 'guardian');
      }
    }
  });
});
