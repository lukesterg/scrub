import * as scrub from '..';
import { allTypes, successOrFailure } from './common';

describe('type tests', () => {
  test('date is valid', () => {
    const expected = new Date();
    const actual = scrub.date().validate(expected);
    expect(actual).toBe(expected);
  });

  const invalidType = allTypes.map((value) => [typeof value, value]);
  test.each(invalidType)('type %s is invalid', (_, value) => {
    const validator = scrub.date();
    const perform = () => validator.validate(value);
    expect(perform).toThrow();
  });
});

describe('serialization test', () => {
  const defaultSettings = {
    allowTypes: [],
    empty: false,
  };

  test('default options', () => {
    const schema = scrub.date();
    expect(schema.serialize()).toEqual(defaultSettings);
  });

  test('default options can be overridden', () => {
    const schema = scrub.date({ maxRangeNow: true });
    expect(schema.serialize()).toEqual({ ...defaultSettings, maxRangeNow: true });
  });
});

describe('range test', () => {
  test.each([
    [new Date(2000, 2, 1), new Date(2000, 1, 1), true, true],
    [new Date(2000, 1, 1), new Date(2000, 1, 1), false, true],
    [new Date(2000, 1, 1), new Date(2000, 1, 1), false, false],
  ])('min=%s max=%s minInclusive=%s maxInclusive=%s isValid=false', (min, max, minInclusive, maxInclusive) => {
    const action = () =>
      scrub.date({
        min: { value: min, inclusive: minInclusive },
        max: { value: max, inclusive: maxInclusive },
      });
    expect(action).toThrow();
  });

  test('value=now min=now max=now isValid=true', () => {
    const expected = new Date();
    const actual = scrub.date({ min: expected, max: expected }).validate(expected);
    expect(actual).toBe(expected);
  });

  test.each([
    [new Date(2000, 1, 1), true, false],
    [new Date(2000, 1, 1), true, true],
    [new Date(2000, 1, 2), true, true],
    [new Date(2000, 1, 3), true, true],
    [new Date(2000, 1, 4), true, false],
    [new Date(2000, 1, 2), false, false],
    [new Date(2000, 1, 1), false, false],
    [new Date(2000, 1, 2), false, true],
    [new Date(2000, 1, 2), false, false],
    [new Date(2000, 1, 4), false, false],
  ])('value=%s min=2000/1/1 max=2000/1/3 inclusive=%s valid=%s', (value, inclusive, valid) => {
    const schema = scrub.date({
      min: { value: new Date(2000, 1, 1), inclusive },
      max: { value: new Date(2000, 1, 3), inclusive },
    });
    successOrFailure(schema, value, valid, value);
  });

  test.each([
    [-1, false],
    [2000, true], // the test takes time to complete so you cannot test now
  ])('minRangeNow=True offsetFromNow=%s isValid=%s', (offset, valid) => {
    const schema = scrub.date({ minRangeNow: true });
    const value = new Date(new Date().getTime() + offset);
    successOrFailure(schema, value, valid, value);
  });

  test.each([
    [-2000, true],
    [1, false], // the test takes time to complete so you cannot test now
  ])('minRangeNow=True offsetFromNow=%s isValid=%s', (offset, valid) => {
    const schema = scrub.date({ maxRangeNow: true });
    const value = new Date(new Date().getTime() + offset);
    successOrFailure(schema, value, valid, value);
  });
});

// Conversions are not tested well because it just uses the JS date conversions.
// JS dates are very confusing because of timezones. For instance new Date('2000/1/1') !== new Date(2000, 1, 1).
describe('conversions', () => {
  test('string can be converted', () => {
    const actual = scrub.date({ allowTypes: ['all'] }).validate('2000/1/1');
    expect(new Date('2000/1/1')).toEqual(actual);
  });

  test('string can be converted', () => {
    const timestamp = new Date().getTime();
    const actual = scrub.date({ allowTypes: ['all'] }).validate(timestamp);
    expect(new Date(timestamp)).toEqual(actual);
  });
});

describe('choices', () => {
  test('empty choice throws', () => {
    const perform = () => scrub.date({ choices: [] });
    expect(perform).toThrow();
  });

  const choicesTest: [(Date | undefined)[], any, boolean][] = [
    [[new Date(2000, 1, 1)], new Date(2000, 1, 1), true],
    [[new Date(2000, 1, 1)], new Date(2000, 1, 2), false],
    [[new Date(2000, 1, 1), new Date(2000, 1, 2)], new Date(2000, 1, 2), true],
    [[new Date(2000, 1, 1), new Date(2000, 1, 2)], new Date(2000, 1, 3), false],
    [[undefined], undefined, true],
    [[undefined], new Date(2000, 1, 1), false],
  ];

  test.each(choicesTest)('choices=%s value=%s valid=%s', (choices, value, valid) => {
    const schema = scrub.date({ choices, empty: true });
    successOrFailure(schema, value, valid, value);
  });
});

describe('empty tests', () => {
  const requiredTests: [Date | string | undefined, boolean, boolean][] = [
    [undefined, true, true],
    [undefined, false, false],
    ['', true, true],
    ['', false, false],
    ['2020-01-01', true, true],
    ['2020-01-01', false, true],
    [new Date(), true, true],
    [new Date(), false, true],
  ];
  test.each(requiredTests)('value=%s empty=%s valid=%s', (value, empty, valid) => {
    const schema = scrub.date({ empty, allowTypes: 'all' });
    let expectedValue = value;
    if (value === '') {
      expectedValue = undefined;
    } else if (typeof value === 'string') {
      expectedValue = new Date(value);
    }
    successOrFailure(schema, value, valid, expectedValue);
  });
});
