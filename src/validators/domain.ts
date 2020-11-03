// import { Allow, generateShouldAllow } from './allow';

// // See https://tools.ietf.org/html/rfc1035 (section 2.3.4)
// export const maximumDomainLength = 255;

// // 4 segments of numbers from 0-255 (eg: 123.123.123.123)
// const validateIpv4 = (value: string) =>
//   /^([0-2][0-9]{2}|[0-9]{1,2})\.([0-2][0-9]{2}|[0-9]{1,2})\.([0-2][0-9]{2}|[0-9]{1,2})\.([0-2][0-9]{2}|[0-9]{1,2})$/.test(
//     value
//   );

// const validateHostName = (value: string) => {
//   const domainLabelMaxLength = 63;
//   if (/[^a-z0-9._-]/.test(value) || value.length > maximumDomainLength) {
//     return false;
//   }

//   const labels = value.split('.');
//   const labelTooLongOrEmpty = labels.some((i) => i.length > domainLabelMaxLength || i.length === 0);
//   return labels.length > 1 && !labelTooLongOrEmpty;
// };

// // copied from https://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
// const validateIpv6 = (value: string) =>
//   /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(
//     value
//   );

// export interface DomainValidationOptions extends Allow<'ip' | 'ipv4' | 'ipv6' | 'domain'> {}

// export const validateDomain = (domain: string, options: DomainValidationOptions) => {
//   const shouldAllow = generateShouldAllow(options);

//   if ((shouldAllow('ip') || shouldAllow('ipv4')) && validateIpv4(domain)) {
//     return true;
//   }

//   if ((shouldAllow('ip') || shouldAllow('ipv6')) && validateIpv6(domain)) {
//     return true;
//   }

//   if (shouldAllow('domain') && validateHostName(domain)) {
//     return true;
//   }

//   return false;
// };
