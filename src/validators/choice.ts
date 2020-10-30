import { arrayToCommaListString, ScrubError } from '../utilities';
import { ValidationState } from '../validator';

export interface Choices<T> {
  choices: T[];
}

export const generateChoices = <T>(options?: Partial<Choices<T>>) => {
  if (!options?.choices) {
    return () => true;
  }

  if (options.choices.length === 0) {
    throw new ScrubError('must have at least one element in a choice');
  }

  const choices = new Set<T>(options.choices);
  return (state: ValidationState) =>
    state.assert(choices.has(state.value), `value must be one of ${arrayToCommaListString(options.choices!)}`);
};
