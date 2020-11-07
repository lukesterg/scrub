import { fields } from '..';
import { successOrFailure } from './common';
import { allDomainTests } from './domain.test';

const domainTests = allDomainTests.map(([type, host, success]) => [type, `a@${host}`, success]);

const userTests = [
  ['valid.email@a.com', true],
  ['valid-email@a.com', true],
  ['valid+email@a.com', true],
  ['"valid email"@a.com', true],
  ['(abc)valid-email@a.com', true],
  ['valid-email(def)@a.com', true],
  ['(abc)valid-email(def)@a.com', true],
  ['__@a.com', true],
  ['@a.com', false],
  ['a@', false],
  ['a', false],
  ['Joe Smith <email@example.com>', false],
  ['a"@', false],
  ['1234567890123456789012345678901234567890123456789012345678901234@a.com', true],
  ['12345678901234567890123456789012345678901234567890123456789012345@a.com', false],
].map((entry) => ['all', ...entry]);

const emailTests = userTests.concat(domainTests) as [any, string, boolean][];

describe('email verification tests', () => {
  test.each(emailTests)('allow=%s value=%s isValid=%s', (allow, value, isValid) => {
    const schema = fields.email({ allow: allow as any });
    successOrFailure(schema, value, isValid, value);
  });
});

describe('schema test', () => {
  const defaultSettings = {
    allow: ['domain'],
    maxLength: 320,
    allowTypes: [],
    empty: false,
  };

  test('default options', () => {
    const schema = fields.email();
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = fields.email({ allow: ['ip'] });
    expect(schema.serialize()).toEqual({ ...defaultSettings, allow: ['ip'] });
  });
});
