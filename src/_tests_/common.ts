export const allTypes: any[] = ['string', 1, BigInt(123), false, Symbol(), undefined, {}, () => {}];

export const successOrFailure = (method: () => void, success: boolean, expected?: any) => {
  try {
    const result = method();
    expect(success).toBeTruthy();
    expect(result).toBe(expected);
  } catch (e) {
    expect(success).toBeFalsy();
  }
};

export const successfulValidation = (value: any) => ({
  success: true,
  errors: [],
  value,
});

export const failedValidation = (errorCount: number = 1) => ({
  success: false,
  errors: Array(errorCount).fill(expect.any(String)),
  value: undefined,
});
