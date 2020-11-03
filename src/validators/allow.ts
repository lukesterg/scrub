export type AllAllowOptions<T> = T | 'all';
export type AllowOptions<T> = AllAllowOptions<T> | AllAllowOptions<T>[];

export interface AllowUserOptions<T> {
  allow: AllowOptions<T>;
}

export class Allow<T> {
  private _hasAll: boolean = false;
  private _allow: Set<AllAllowOptions<T>> = new Set();

  constructor(options: { default: AllowOptions<T> }) {
    this.allow = options.default;
  }

  get allow(): AllowOptions<T> {
    return [...this._allow];
  }

  set allow(value: AllowOptions<T>) {
    this._allow = new Set(Array.isArray(value) ? value : [value]);
    this._hasAll = this._allow.has('all');
  }

  test(value: any): boolean {
    return this._hasAll || this._allow.has(value);
  }
}

export interface AllowTypesUserOptions<T> {
  allowTypes: AllowOptions<T>;
}

export type ConversionMethod = (value: any) => any;
export type ConversionCallback<T extends string> = { [key in T]: ConversionMethod };

export class AllowTypeConverter<ConversionTypes extends string> extends Allow<ConversionTypes> {
  convert(value: any, convert: ConversionCallback<ConversionTypes>, scope: any) {
    const typeName = typeof value;
    if (!this.test(typeName)) {
      return value;
    }

    const callback = (convert as any)[typeName] as ConversionMethod;
    return callback ? callback.bind(scope)(value) : value;
  }
}
