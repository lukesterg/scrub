export const fromEntries = <ValueType>(entries: [string, ValueType][]) =>
  entries.reduce((last, [key, value]) => {
    last[key] = value;
    return last;
  }, {} as any) as { [key: string]: ValueType };

export class ScrubError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, ScrubError.prototype);
  }
}
