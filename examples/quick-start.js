const scrub = require('@framed/scrub');

const personValidator = scrub.object({
  name: scrub.string({ transformString: ['trim', 'title'] }),
  age: scrub.number({ min: 18 }),
});

const validPerson = {
  name: 'Homer Simpson',
  age: 39,
};

personValidator.validate(validPerson);
// { name: 'Homer Simpson', age: 39 }
