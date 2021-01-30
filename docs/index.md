# Scrub

## Quick start

To install run:

```bash
<!--- #if SCRUB -->
npm i @framed/scrub
<!--- #else -->
npm i @framed/react-forms @framed/scrub
<!--- #endif -->

```

To validate an object:

=== "Typescript"
    ```ts
    --8<-- "examples/quick-start.ts"
    ```

=== "JavaScript"
    ```js
    --8<-- "examples/quick-start.js"
    ```

## Validators

Validators are setup during construction and can be modified using the same keys on the objects.

### String

#### empty
If empty is true then the string may contain no characters. If not specified the string must contain a value.

Example: `scrub.string({ empty: true })`.


#### minLength
Specifies the minimum number of characters. If not specified the length is not checked.

Example: `scrub.string({ minLength: 3 })`.


#### maxLength
Specifies the maximum number of characters. If not specified the length is not checked.

Example: `scrub.string({ maxLength: 10 })`.

#### choices
An array of items which the value is allowed to be. If not specified the value is not checked.

Example: `scrub.string({ choices: ['true', 'false'] })`.


#### allowTypes
Specifies types that are not strings that will be converted. These types can be `number`, `boolean`, `bigint` or `all`. These types can also be use in array to select multiple. If not specified only strings are allowed.

Example: `scrub.string({ allowTypes: 'all' })` or `scrub.string({ allowTypes: ['number', 'bigint'] })`.

#### transform
Transform the string before running the validation checks. The types of transformation can be:
    * trimStart - remove white space from the start of the string.
    * trimEnd - remove white space from the end of the string.
    * trim - remove white space from both the start and end.
    * upperCase - all characters will be capital letters.
    * lowerCase - all characters will be small letters.
    * title - the first letter of every word will be capitalized.
    * upperCaseFirst - only the first letter will be capitalized.

Transformations can be specified with as a string or as an array containing multiple entries. If not specified the string is not modified.

Example: `scrub.string({ transform: 'trim' })` or `scrub.string({ allowTypes: ['trim', 'title'] })`.

### Number

#### allowTypes
The only allowed type is 'string'. A string will be converted if it can be accurately converted using the validation rules specified.

If a long decimal is to be used it is a good idea to also set a precision as this will help in the conversion.

If this value is not specified only numbers are allowed.

Example: `scrub.number({ allowTypes: 'string', precision: 4 })`.


#### empty
If allowTypes is `string` and empty is true the number will not be defined. If not specified a number must be entered.

Example: `scrub.number({ allowTypes: 'string', precision: 4, empty: true })`.

#### min
Specifies the minimum number allowed. This field can either be:
* An object containing both value and whether it is inclusive, or
* A number which is the minimum value (inclusive).

These are described in the examples below. If this value is not specified the number can be any value.

Example: `scrub.number({ min: 3 })` or `scrub.number({ min: { value: 3, inclusive: false } })`.


#### max
Specifies the maximum number allowed. This field can either be:
* An object containing both value and whether it is inclusive, or
* A number which is the maximum value (inclusive).

These are described in the examples below. If this value is not specified the number can be any value.

Example: `scrub.number({ max: 10 })` or `scrub.number({ max: { value: 10, inclusive: false } })`.

#### choices
An array of items which the value is allowed to be. The default is any value is allowed.

Example: `scrub.number({ choices: [2, 4, 6, 8] })`.

#### precision

The maximum number of decimals. If this value is not specified then the number will be unchanged.

Example: `scrub.number({ precision: 2 })`.

### Boolean

#### allowTypes
Allow types can either be 'string', 'number' or 'all'. Numbers will convert a non-zero value to true and a zero value to false. A string will convert 'yes', 'true', '1', 't' to true and 'no', 'false', '0', 'f' to false.

Example: `scrub.boolean({ allowTypes: 'all' })`.

#### choices
An array of items which the value is allowed to be. The default is any value is allowed.

Example: `scrub.boolean({ choices: [true] })`.

#### empty
If true the field can result in an undefined value. If string conversions are allowed and the string is empty and empty is true, the value will be undefined.

Example: `scrub.date({ empty: true )`.

### Date

#### allowTypes
Allow types can either be 'string', 'number' or 'all'. Both numbers and string are parsed using the JavaScript date function (i.e.: new Date(value)). Numbers must be UNIX timestamps with milli-seconds precision and date strings can be in any format, it is recommended to parse year leading dates for compatibility.

Example: `scrub.date({ allowTypes: 'all' })`.

#### choices
An array of items which the value is allowed to be. The default is any value is allowed.

Example: `scrub.date({ choices: [new Date(2000, 1, 1), new Date(2000, 1, 2)] })`.

#### empty
If true the field can result in an undefined value. If string conversions are allowed and the string is empty and empty is true, the value will be undefined.

Example: `scrub.date({ empty: true )`.

#### min
Specifies the minimum date allowed. This field can either be:
* An object containing both a date and whether it is inclusive, or
* A date which is the minimum value (inclusive).

These are described in the examples below. If this value is not specified the number can be any value.

Example: `scrub.date({ min: new Date(2000, 1, 1) })` or `scrub.date({ min: { value: new Date(2000, 1, 1), inclusive: false } })`.

#### minRangeNow
If this value is true then the date must be less than the current time.

Example: `scrub.date({ minRangeNow: true })`.

#### max
Specifies the maximum date allowed. This field can either be:
* An object containing both a date and whether it is inclusive, or
* A number which is the maximum date (inclusive).

These are described in the examples below. If this value is not specified the date can be any value.

Example: `scrub.date({ max: new Date(2000, 1, 1) })` or `scrub.date({ max: { value: new Date(2000, 1, 1), inclusive: false } })`.

#### maxRangeNow
If this value is true then the date must be less than the current time.

Example: `scrub.date({ maxRangeNow: true })`.

### Domain

Domain has all the string validation options.

#### allow
Specifies the types allowed:
* domain - a domain name name as described in RFC1035 (eg: www.github.com).
* ipv4 - IPv4 ip address (eg: 127.0.0.1).
* ipv6 - IPv6 ip address (eg: ::1).
* ip - both ipv4 and ipv6.
* all - all of the above.

These types can also be use in array to select multiple. If not specified domains are allowed.

Example: `scrub.domain({ allowTypes: 'all' })`.

### Email

#### allow
Specifies the types allowed:
* domain - a domain name name as described in RFC1035 (eg: www.github.com).
* ipv4 - IPv4 ip address (eg: 127.0.0.1).
* ipv6 - IPv6 ip address (eg: ::1).
* ip - both ipv4 and ipv6.
* all - all of the above.

These types can also be use in array to select multiple. If not specified domains are allowed.

Example: `scrub.email({ allowTypes: 'all' })`.

### URI

#### allow
Specifies the types allowed:
* domain - a domain name name as described in RFC1035 (eg: www.github.com).
* ipv4 - IPv4 ip address (eg: 127.0.0.1).
* ipv6 - IPv6 ip address (eg: ::1).
* ip - both ipv4 and ipv6.
* all - all of the above.

These types can also be use in array to select multiple. If not specified all types are allowed.

Example: `scrub.uri({ allowTypes: 'all' })`.

#### allowedProtocols

The protocols which are allowed in the URI. If not specified any protocol is allowed.

Example: `scrub.uri({ allowedProtocols: ['https'] })`.

#### protocolOptional

If true the URI string does not need to include the protocol.

Example: `scrub.uri({ protocolOptional: true })`.

### Password

Password has all the string validation options.

The default password validation is everything off. This is to allow the program to specify the default settings.

#### ignoreRequirementsIfLengthIsAtLeast
If the value is longer then the specified length, then the value is valid without looking at the other password specific requirements.

Example: `scrub.example({ ignoreRequirementsIfLengthIsAtLeast: 12, requireLowerCase: true })`.


#### requireLowerCase
If the value is true then a lowercase (or little character) is required. If not specified this check is skipped.

#### requireUpperCase
If the value is true then a lowercase (or little character) is required. If not specified this check is skipped.

#### requireNumber
If the value is true then a digit is required. If not specified this check is skipped.

#### requireSymbol
If the value is true then a symbol (such as '!') is required. If not specified this check is skipped.

## Advanced

### Conditional validation

See [Custom Validation](#custom-validation) to perform conditional validation.

### Custom validation

Inside the object validator is a callback `customValidation` which is called when each field in the object is validated.

This field allows you to update the validation before it is returned, in this method you can:

* Add, update or remove errors
* Modify cleaned values

The following shows an example where the field `guardian` is required if the age of the person is under 18.

=== "Typescript"
    ```ts
    --8<-- "examples/custom-validation.ts"
    ```

=== "JavaScript"
    ```js
    --8<-- "examples/custom-validation.js"
    ```

### Schema

To fetch an objects schema run the method `validator.serialize()` on any validator. This will create a JSON representation of the object.

Serialized objects may contain additional fields that were not passed by the user but are used for checks.

Serialization would be useful for:
* Form validation - as you can fetch properties such as the field maximum length or if a field is required,
* Database ORM - field maximum length,
* Documentation - such as documenting an API,
* etc.

