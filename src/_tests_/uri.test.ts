// import { UriOptions } from '../types';
// import { fields, validate } from '..';
// import { failedValidation, successfulValidation } from './common';

// describe('uri tests', () => {
//   // prettier-ignore
//   const passwordTests: [Partial<UriOptions>, string, boolean][] = [
//     [{empty: true}, '', false],
//     [{}, 'a', false],
//     [{}, 'http:', false],
//     [{}, 'http://www.domain.com', true],
//     [{}, 'http://www.domain.com/path', true],
//     [{}, 'http://www.domain.com/path?query=dfd#target', true],
//     [{}, 'http://a:a@www.domain.com/path?query=dfd#target', true],
//     [{}, 'http://a:a@www.domain.com:3434/path?query=dfd#target', true],
//     [{}, 'http://a:a@1.1.1.1:3434/path?query=dfd#target', true],
//     // IPv6 does not seem to be supported in node
//     // [{}, 'http://a:a@::1:3434/path?query=dfd#target', false],
//     // [{}, 'http://[::1]:34/path?query=dfd#target', true],
//     [{ allowedProtocols: ['https']}, 'http://www.domain.com/path?query=dfd#target', false],
//     [{ allowedProtocols: ['https']}, 'https://www.domain.com/path?query=dfd#target', true],

//   ];

//   test.each(passwordTests)('options=%s value=%s isValid=%s', (options, value, success) => {
//     const schema = fields.uri(options);

//     const validationResult = validate({ schema, value });

//     expect(validationResult).toEqual(success ? successfulValidation(value) : failedValidation(1));
//   });
// });

// describe('schema test', () => {
//   const defaultSettings: UriOptions = {
//     empty: false,
//     allow: ['all'],
//   };

//   test('default options', () => {
//     const schema = fields.uri();
//     expect(schema.schema).toEqual(defaultSettings);
//   });

//   test('default options can be overridden', () => {
//     const schema = fields.uri({ allowedProtocols: ['http'] });
//     expect(schema.schema).toEqual({ ...defaultSettings, allowedProtocols: ['http'] });
//   });
// });
