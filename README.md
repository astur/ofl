# ofl

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

Convertion between nested object and flat one with delimited keys. Yet another flatten/unflatten module with few differences:

* no undefined values allowed
* only primitives in arrays (no nested arrays and so on)
* only plain objects
* empty objects are ignored when flatten
* only own and enumerable fields counts when flatten
* no key conflicts allowed in flat object
* no delimiter string in any key in nested object

It is intended to be useful for work with well-serializable config data.

## Install

```bash
npm install ofl
```

## Usage

```js
const {
    flatten, //convert nested object to flat
    unflatten, //convert flat object to nested
    patch, //cange some fields in flat object
    validKeys, //test if array of keys are valid for flat object
    validValues,  //test if array of values are valid for flat object
} = require('ofl');

flatObj = flatten(nestedObj, delimiter);
nestedObj = unflatten(flatObj, delimiter);
//throw error if inappropriate object sent
//delimiter is optional, defaults to '.'

patchedFlatObj = patch(flatObj, diffFlatObj);
//throw error if diffFlatObj keys is not subset of flatObj keys

validKeys(Object.keys(flatObj));
validValues(Object.values(flatObj));
//throw error if inappropriate key or value
```

## License

MIT

[npm-url]: https://npmjs.org/package/ofl
[npm-image]: https://badge.fury.io/js/ofl.svg
[travis-url]: https://travis-ci.org/astur/ofl
[travis-image]: https://travis-ci.org/astur/ofl.svg?branch=master