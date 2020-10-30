import { validateDomain, DomainValidationOptions } from '../validators/domain';

export interface UriValidationOptions extends DomainValidationOptions {
  allowedProtocols?: string[];
}

export const validUri = (uri: string, options: UriValidationOptions) => {
  let parsed: URL;

  try {
    parsed = new URL(uri);
  } catch (e) {
    return false;
  }

  if (options.allowedProtocols) {
    const allowedProtocols = options.allowedProtocols.map((i) => `${i.toLowerCase()}:`);
    if (allowedProtocols.indexOf(parsed.protocol) < 0) {
      return false;
    }
  }

  if (!validateDomain(parsed.hostname, options)) {
    return false;
  }

  return true;
};
