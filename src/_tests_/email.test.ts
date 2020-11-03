// import { allDomainTests } from './domain.test';
// import { fields, validate } from '..';
// import { failedValidation, successfulValidation } from './common';

// const domainTests = allDomainTests.map(([type, host, success]) => [type, `a@${host}`, success]);

// const userTests = [
//   ['valid.email@a.com', true],
//   ['valid-email@a.com', true],
//   ['valid+email@a.com', true],
//   ['"valid email"@a.com', true],
//   ['(abc)valid-email@a.com', true],
//   ['valid-email(def)@a.com', true],
//   ['(abc)valid-email(def)@a.com', true],
//   ['__@a.com', true],
//   ['@a.com', false],
//   ['a@', false],
//   ['a', false],
//   ['Joe Smith <email@example.com>', false],
//   ['a"@', false],
//   ['1234567890123456789012345678901234567890123456789012345678901234@a.com', true],
//   ['12345678901234567890123456789012345678901234567890123456789012345@a.com', false],
// ].map((entry) => ['all', ...entry]);

// const emailTests = userTests.concat(domainTests) as [any, string, boolean][];

// describe('email verification tests', () => {
//   test.each(emailTests)('allow=%s value=%s isValid=%s', (allow, value, isValid) => {
//     const schema = fields.email({ allow: allow as any });

//     const validationResult = validate({ schema, value });

//     expect(validationResult).toEqual(isValid ? successfulValidation(value) : failedValidation());
//   });
// });

// describe('schema test', () => {
//   const defaultSettings = {
//     allow: ['domain'],
//     maxLength: 320,
//     empty: false,
//   };

//   test('default options', () => {
//     const schema = fields.email();
//     expect(schema.schema).toEqual(defaultSettings);
//   });

//   test('default options can be overridden', () => {
//     const schema = fields.email({ allow: ['ip'] });
//     expect(schema.schema).toEqual({ ...defaultSettings, allow: ['ip'] });
//   });
// });
