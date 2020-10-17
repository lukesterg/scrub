import { TypeOfTypes } from '../types';
import { ScrubError } from '../utilities';
import { ValidationState } from '../validator';

type ConversionCallback<T> = (state: ValidationState, options: T) => void;
export type Conversions<T> = { [type: string]: ConversionCallback<T> };

export const allowedTypeConverter = <T>(
  allowedConversions: string | string[] | undefined,
  expectedType: TypeOfTypes,
  conversions: Conversions<T>
) => {
  if (!allowedConversions) {
    return () => true;
  }

  const indexedConversions = new Set(Array.isArray(allowedConversions) ? allowedConversions : [allowedConversions]);
  const hasAll = indexedConversions.has('all');

  const canConvert = (type: string) => hasAll || indexedConversions.has(type);

  return (state: ValidationState, options: T) => {
    const inputType = typeof state.value;
    if (inputType === expectedType) return true;

    const conversion = conversions[inputType];

    if (!canConvert(inputType) || !conversion) return true;

    conversion(state, options);
    return state.errors.length === 0;
  };
};
