"use strict";
exports.__esModule = true;
var scrub = require("@framed/scrub");
var personValidator = scrub.object({
    fields: {
        name: scrub.string({ transformString: ['trim', 'title'] }),
        age: scrub.number({ allowTypes: ['string'] }),
        guardian: scrub.string({ transformString: ['trim', 'title'], empty: true })
    },
    additionalFields: 'error',
    cleanCallback: function (state) {
        if (state.cleanedFields.age < 18 && state.cleanedFields.guardian === '') {
            state.addError('Parent or guardian name is required if the person is under 18 years of age', 'guardian');
        }
    }
});
var validPerson = {
    name: 'Bart Simpson',
    age: '10',
    guardian: ''
};
console.log(personValidator.validate(validPerson));
// { name: 'Homer Simpson', age: 39 }
