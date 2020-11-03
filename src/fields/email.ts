// import { DomainOptions, ScrubField, UserDomainOptions } from '../types';
// import { ValidationCallback, ValidationState } from '../validator';
// import { maximumEmailLength, validateEmail } from '../validators/email';
// import { string } from './string';
// import { UserEmailOptions, EmailOptions } from '../types';

// const defaultEmailOptions: EmailOptions = {
//   maxLength: maximumEmailLength,
//   empty: false,
//   allow: ['domain'],
// };

// export const email = (options?: Partial<UserEmailOptions>): ScrubField<string, EmailOptions> => {
//   const schema = { ...defaultEmailOptions, ...options };
//   const { validate: stringValidate } = string(options);

//   const validate: ValidationCallback = (state: ValidationState) => {
//     stringValidate(state);
//     if (typeof state.value !== 'string' || state.value === '') {
//       return;
//     }

//     state.assert(validateEmail(state.value, schema), 'Please enter a valid email');
//   };

//   return { validate, schema };
// };
