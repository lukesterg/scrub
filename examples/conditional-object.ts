import * as scrub from '@framed/scrub';

const personValidator = scrub.object({
  fields: {
    name: scrub.string({ transformString: ['trim', 'title'] }),
    age: scrub.number({ allowTypes: ['string'] }),
    guardian: scrub.string({ transformString: ['trim', 'title'], empty: true }),
  },
  customValidation: (state) => {
    if (state.cleanedFields.age < 18 && state.cleanedFields.guardian === '') {
      state.addError('Parent or guardian name is required if the person is under 18 years of age', 'guardian');
    }
  },
});

type PersonType = scrub.GetType<typeof personValidator>;
const validPerson: PersonType = {
  name: 'Bart Simpson',
  age: '10' as any,
  guardian: '',
};

console.log(personValidator.validate(validPerson));
// { name: 'Homer Simpson', age: 39 }
