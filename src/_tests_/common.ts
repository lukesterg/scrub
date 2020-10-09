export const allTypes: any[] = ['string', 1, BigInt(123), false, Symbol(), undefined, {}, () => {}];

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
