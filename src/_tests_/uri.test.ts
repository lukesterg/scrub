import * as scrub from '..';
import { UriOptions } from '../fields/uri';
import { successOrFailure } from './common';

describe('uri tests', () => {
  // prettier-ignore
  const uriTests: [Partial<UriOptions>, string, boolean][] = [
    [{empty: true}, '', false],
    [{}, 'a', false],
    [{}, 'http:', false],
    [{}, 'http://www.domain.com', true],
    [{}, 'http://www.domain.com/path', true],
    [{}, 'http://www.domain.com/path?query=dfd#target', true],
    [{}, 'http://a:a@www.domain.com/path?query=dfd#target', true],
    [{}, 'http://a:a@www.domain.com:3434/path?query=dfd#target', true],
    [{}, 'http://a:a@1.1.1.1:3434/path?query=dfd#target', true],
    // IPv6 does not seem to be supported in node
    // [{}, 'http://a:a@::1:3434/path?query=dfd#target', false],
    // [{}, 'http://[::1]:34/path?query=dfd#target', true],
    [{ allowedProtocols: ['https']}, 'http://www.domain.com/path?query=dfd#target', false],
    [{ allowedProtocols: ['https']}, 'https://www.domain.com/path?query=dfd#target', true],

  ];

  test.each(uriTests)('options=%s value=%s isValid=%s', (options, value, isValid) => {
    const schema = scrub.uri(options);
    successOrFailure(schema, value, isValid, value);
  });
});

describe('schema test', () => {
  const defaultSettings: UriOptions = {
    empty: false,
    allow: ['all'],
    allowTypes: [],
  };

  test('default options', () => {
    const schema = scrub.uri();
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = scrub.uri({ allowedProtocols: ['http'] });
    expect(schema.serialize()).toEqual({ ...defaultSettings, allowedProtocols: ['http'] });
  });
});
