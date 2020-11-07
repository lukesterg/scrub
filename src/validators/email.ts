import { DomainValidationOptions, maximumDomainLength, validateDomain } from './domain';

const maximumUsername = 64;
export const maximumEmailLength = maximumUsername + 1 + maximumDomainLength; // <username>@<domain>

export type EmailValidationOptions = DomainValidationOptions;

export const validateEmail = (value: string, options: EmailValidationOptions) => {
  const parts = value.split('@', 3);
  if (parts.length !== 2) {
    return false;
  }

  let [username, domain] = parts;
  if (!validateDomain(domain, options)) {
    return false;
  }

  if (username.length > maximumUsername) {
    return false;
  }

  // https://en.wikipedia.org/wiki/Email_address#Local-part
  // strip comments () at either the start or end
  let commentMatch = username.match(/^(\([^)]*\))?([^(]*)(\([^)]*\))?$/);
  username = commentMatch ? commentMatch[2] : username;

  const quoted = username.match(/^"(.*)"$/);
  if (quoted) {
    username = quoted[1];
  }

  if (!quoted && /(^\.|\.$|\.\.)/.test(username)) {
    return false;
  }

  return quoted
    ? /^[\u0020-\u007e\u00a0-\u00ff]*$/.test(username) && !/[\\"]/.test(username)
    : /^[a-zA-Z0-9!#$%&'*+/=?^_`.{|}~-]+$/.test(username);
};
