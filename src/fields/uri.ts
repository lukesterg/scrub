// import { UriOptions, ScrubField } from '../types';
// import { ValidationCallback, ValidationState } from '../validator';
// import { string } from './string';
// import { validUri } from '../validators/uri';

// const defaultUriOptions: UriOptions = {
//   allow: ['all'],
//   empty: false,
// };

// export const uri = (options?: Partial<UriOptions>): ScrubField<string, UriOptions> => {
//   const schema = { ...defaultUriOptions, ...options };

//   const { validate: stringValidate } = string(schema);

//   const validate: ValidationCallback = (state: ValidationState) => {
//     stringValidate(state);
//     if (typeof state.value !== 'string') {
//       return;
//     }

//     state.assert(validUri(state.value, schema), 'Please enter a valid uri');
//   };

//   return { validate, schema };
// };
