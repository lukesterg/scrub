import { ValidationState, TypeOfTypes } from '../types';

export const validateType = (validate: ValidationState, type: TypeOfTypes): boolean =>
  validate.assert(typeof validate.value === type, `Value must be of type ${type}`);
