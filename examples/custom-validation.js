var scrub = require('@framed/scrub');

var personValidator = scrub.object({
  fields: {
    name: scrub.string({ transformString: ['trim', 'title'] }),
    age: scrub.number({ allowTypes: ['string'] }),
    guardian: scrub.string({ transformString: ['trim', 'title'], empty: true }),
  },
  customValidation: function (state) {
    if (state.cleanedFields.age < 18 && state.cleanedFields.guardian === '') {
      state.addError('Parent or guardian name is required if the person is under 18 years of age', 'guardian');
    }
  },
});

var validPerson = {
  name: 'Homer Simpson',
  age: '39',
  guardian: '',
};

console.log(personValidator.validate(validPerson));
// { name: 'Homer Simpson', age: 39 }

console.log(
  personValidator.validate(
    {
      name: 'Bart Simpson',
      age: '10',
      guardian: '',
    },
    { throwOnFailure: false }
  )
);
// {
//   result: undefined,
//   success: false,
//   error: 'Object failed to validate',
//   fields: {
//     guardian: 'Parent or guardian name is required if the person is under 18 years of age'
//   }
// }
