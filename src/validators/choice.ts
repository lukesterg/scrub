import { arrayToCommaListString, assert, ScrubError } from '../utilities';

export type AllChoiceOptions<T> = T | T[] | undefined;

export interface ChoicesUserOptions<T> {
  choices: AllChoiceOptions<T> | undefined;
}

export class Choices<T> implements ChoicesUserOptions<T> {
  private _choices?: Set<T>;
  private _error?: string;

  public get choices(): AllChoiceOptions<T> | undefined {
    if (!this._choices) {
      return;
    }

    return [...this._choices];
  }

  public set choices(value: AllChoiceOptions<T> | undefined) {
    if (value === undefined) {
      this._choices = undefined;
      return;
    }

    const arrayChoices = Array.isArray(value) ? value : [value];
    if (arrayChoices.length === 0) {
      throw new ScrubError('at least one value must be specified');
    }

    this._error = `value must be one of ${arrayToCommaListString(arrayChoices)}`;
    this._choices = new Set(arrayChoices);
  }

  test(value: any) {
    if (!this._choices) {
      return;
    }

    assert(this._choices.has(value), this._error!);
  }
}
