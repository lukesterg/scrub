type TypeOfTypes = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';

type ErrorType = { [key: string]: string[] | ErrorType } | string[];

type ObjectErrorType = { [key: string]: ErrorType };

type ObjectAdditionalFieldType = 'strip' | 'merge' | 'error';
