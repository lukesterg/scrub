export interface Allow<T> {
  allow: (T | 'all')[] | (T | 'all');
}

const normalizeAllow = <T>(allow: Allow<T> | undefined) => {
  let keys = allow?.allow || [];
  if (!Array.isArray(keys)) {
    keys = [keys] as T[];
  }

  return keys;
};

export const hasAllow = <T extends string>(allow: Allow<T> | undefined) =>
  allow !== undefined && normalizeAllow(allow).length > 0;

export const generateShouldAllow = <T extends string>(allow: Allow<T> | undefined, defaultAllow: boolean = true) => {
  if (!hasAllow(allow)) {
    return () => defaultAllow;
  }

  const keys = new Set(normalizeAllow(allow));
  const hasAll = keys.has('all');
  return (type: T) => hasAll || keys.has(type);
};
