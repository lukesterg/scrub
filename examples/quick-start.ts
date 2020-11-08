import * as scrub from '@framed/scrub';

const personValidator = scrub.object({
  name: scrub.string({ transformString: ['trim', 'title'] }),
  age: scrub.number({ min: 18 }),
});

type PersonType = scrub.GetType<typeof personValidator>;
const validPerson: PersonType = {
  name: 'Homer Simpson',
  age: 39,
};

personValidator.validate(validPerson);
// { name: 'Homer Simpson', age: 39 }
