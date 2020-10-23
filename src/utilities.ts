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

export const arrayToCommaListString = (items: any[]) => {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  const copy = [...items];
  const lastItem = copy.pop();
  return `${copy.join(', ')} or ${lastItem}`;
};
