# Jazz

![](https://github.com/lukesterg/scrub/workflows/build/badge.svg?branch=master) [![Documentation Status](https://readthedocs.org/projects/scrub/badge/?version=latest)](https://jazz-orm.readthedocs.io/en/latest/?badge=latest)

## Scrub

Scrub is a simple object validator.

```ts
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
```

## Documentation

To install run `npm i @framed/scrub`.

Please read the documentation at https://scrub.readthedocs.io/en/latest/.
