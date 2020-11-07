import { ValidationField, ObjectValidatorError } from '../common';

export const allTypes: any[] = ['string', 1, BigInt(123), false, Symbol(), undefined, {}, () => {}];

export const successOrFailure = (
  schema: ValidationField<unknown, unknown>,
  value: any,
  success: boolean,
  expected?: any,
  errorFields?: any
) => {
  try {
    const result = schema.validate(value);
    expect(success).toBeTruthy();
    expect(result).toEqual(expected);
  } catch (e) {
    expect(success).toBeFalsy();
    if (errorFields) {
      expect(e instanceof ObjectValidatorError).toBe(true);

      if (e instanceof ObjectValidatorError) {
        if (Array.isArray(errorFields)) {
          expect(Object.keys(e.objectError)).toEqual(expect.arrayContaining(errorFields));
        } else {
          expect(e.objectError).toEqual(errorFields);
        }
      }
    }
  }
};
