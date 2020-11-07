import { fields } from '..';
import { allTypes, successOrFailure } from './common';
import { ObjectAdditionalFieldType } from '../fields/object';

describe('type tests', () => {
  test('object is valid', () => {
    const expected = {};
    const actual = fields.object({ fields: {} }).validate(expected);
    expect(actual).toEqual(expected);
  });

  const invalidType = allTypes.map((value) => [typeof value, value]).filter(([type]) => type !== 'object');
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const validator = fields.object({ fields: {} });
    const perform = () => validator.validate(value);
    expect(perform).toThrow();
  });
});

describe('fields', () => {
  const successfulTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{}, {}, 'strip', {}],
    [{ a: 'a' }, {}, 'strip', {}],
    [{ a: 'a' }, {}, 'merge', { a: 'a' }],
    [{ a: 'a' }, { a: fields.string() }, 'strip', { a: 'a' }],
    [{ a: 'a', b: 'a' }, { a: fields.string(), b: fields.string() }, 'strip', { a: 'a', b: 'a' }],
  ];

  test.each(successfulTests)(
    'input=%s schema=%s additionalField=%s expected=%s is valid',
    (input, objectSchema, additionalFields, expected) => {
      const schema = fields.object({ fields: objectSchema, additionalFields });
      successOrFailure(schema, input, true, expected);
    }
  );

  const invalidTests: [any, any, ObjectAdditionalFieldType, string[]][] = [
    [{ a: '' }, {}, 'error', ['a']],
    [{ a: '', b: '' }, {}, 'error', ['a', 'b']],
    [{ a: '' }, { a: fields.string() }, 'strip', ['a']],
    [{}, { a: fields.string() }, 'strip', ['a']],
    [{}, { a: fields.string() }, 'merge', ['a']],
    [{ a: '', b: '' }, { a: fields.string(), b: fields.string() }, 'strip', ['a', 'b']],
  ];
  test.each(invalidTests)(
    'input=%s schema=%s additionalFields=%s errorField=%s is invalid',
    (input, objectSchema, additionalFields, errorFields) => {
      const schema = fields.object({ fields: objectSchema, additionalFields });
      successOrFailure(schema, input, false, undefined, errorFields);
    }
  );
});

describe('recursion', () => {
  const successfulTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{ a: { b: 'a' } }, { a: { b: fields.string() } }, 'strip', { a: { b: 'a' } }],
    [{ a: { b: 'a' } }, { a: {} }, 'strip', { a: {} }],
    [{ a: { b: { c: 'a' } } }, { a: { b: { c: fields.string() } } }, 'strip', { a: { b: { c: 'a' } } }],
    [{ a: {} }, {}, 'strip', {}],
  ];

  test.each(successfulTests)(
    'input=%s schema=%s additionalField=%s expected=%s',
    (input, objectSchema, additionalFields, expected) => {
      const schema = fields.object({ fields: objectSchema, additionalFields });
      successOrFailure(schema, input, true, expected);
    }
  );

  const invalidTests: [any, any, ObjectAdditionalFieldType, any][] = [
    [{ a: {} }, { a: { b: fields.string() } }, 'strip', { a: { b: expect.any(String) } }],
    [
      { a: { c: {} } },
      { a: { b: fields.string(), c: { d: fields.string() } } },
      'strip',
      { a: { b: expect.any(String), c: { d: expect.any(String) } } },
    ],
    [{ a: { b: 'a' } }, { a: {} }, 'error', { a: { b: expect.any(String) } }],
  ];
  test.each(invalidTests)(
    'input=%s schema=%s additionalFields=%s errorField=%s',
    (input, objectSchema, additionalFields, errorFields) => {
      const schema = fields.object({ fields: objectSchema, additionalFields });
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
    const schema = fields.object({ fields: {} });
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = fields.object({ fields: {}, additionalFields: 'error' });
    expect(schema.serialize()).toEqual({ ...defaultSettings, additionalFields: 'error' });
  });

  test('inner fields schemas are exposed', () => {
    const schema = fields.object({ fields: { a: fields.object({ fields: {} }) } });
    expect(schema.serialize()).toEqual({ ...defaultSettings, fields: { a: defaultSettings } });
  });

  test('nested object schemas are exposed', () => {
    const schema = fields.object({ fields: { a: fields.object({ fields: { b: fields.object({ fields: {} }) } }) } });

    expect(schema.serialize()).toEqual({
      ...defaultSettings,
      fields: { a: { ...defaultSettings, fields: { b: defaultSettings } } },
    });
  });
});
