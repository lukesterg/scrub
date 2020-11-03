// import { fields, validate } from '..';
// import { failedValidation, successfulValidation } from './common';

// const ipV4Tests = [
//   ['', false],
//   ['1', false],
//   ['1.1.1', false],
//   ['1..1', false],
//   ['1..1.1.1', false],
//   ['1.1.1.1', true],
//   ['255.255.255.255', true],
//   ['300.255.255.255', false],
//   ['0.0.0.0', true],
//   ['::1', false],
//   ['a.com', false],
//   ['000.000.000.000', true],
//   ['a.a.a.a', false],
//   ['a', false],
// ].map((i) => ['ipv4', ...i]);

// const ipV6Tests = [
//   ['2001:0db8:0000:0000:0000:ff00:0042:8329', true],
//   ['2001:db8:0:0:0:ff00:42:8329', true],
//   ['2001:db8::ff00:42:8329', true],
//   ['a.com', false],
//   ['::', true],
//   ['::1', true],
//   ['1.1.1.1', false],
//   ['::z', false],
//   ['z', false],
//   ['1', false],
//   ['', false],
// ].map((i) => ['ipv6', ...i]);

// const domainTests = [
//   ['hi.com', true],
//   ['apple.hi.com', true],
//   ['apple.hi$.com', false],
//   ['apple.hi.com:80', false],
//   ['apple.hi.com/path', false],
//   ['', false],
//   ['::1', false],
//   ['a', false],
//   ['123456789012345678901234567890123456789012345678901234567890123.com', true],
//   ['1234567890123456789012345678901234567890123456789012345678901234.com', false],
//   [
//     '1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.12',
//     true,
//   ],
//   [
//     '1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.1234567890.123',
//     false,
//   ],
// ].map((i) => ['domain', ...i]);

// export const allDomainTests = ipV4Tests.concat(ipV6Tests).concat(domainTests) as [any, string, boolean][];

// describe('domain verification tests', () => {
//   test.each(allDomainTests)('allow=%s value=%s isValid=%s', (allow, value, isValid) => {
//     const schema = fields.domain({ allow: allow as any });

//     const validationResult = validate({ schema, value });

//     expect(validationResult).toEqual(isValid ? successfulValidation(value) : failedValidation());
//   });
// });

// describe('schema test', () => {
//   const defaultSettings = {
//     allow: ['domain'],
//     maxLength: 255,
//     empty: false,
//   };

//   test('default options', () => {
//     const schema = fields.domain();
//     expect(schema.schema).toEqual(defaultSettings);
//   });

//   test('default options can be overridden', () => {
//     const schema = fields.domain({ allow: ['ip'] });
//     expect(schema.schema).toEqual({ ...defaultSettings, allow: ['ip'] });
//   });
// });
