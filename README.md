# ofl

Convertion between nested object and flat one with delimited keys.

Yet another flatten/unflatten module with one difference: `ofl` doesn't treat arrays as object. It is intended to be useful for work with config data.

[![NPM version][npm-image]][npm-url]

## Install

```bash
npm install ofl
```

## Usage

```js
const {flatten, unflatten} = require('ofl');

// flat object from nested:
flatObj = flatten(nestedObj, prefix, delimiter);

// nested object from flat:
nestedObj = unflatten(flatObj, prefix, delimiter);
```

In both functions require only one parameter - object for conversion.

Optional `prefix` parameter defines prefix of flat object keys. Defaults to empty string.

Optional `delimiter` parameter defines string to use for split flat object keys. Defaults to `'.'`.

## License

MIT

[npm-url]: https://npmjs.org/package/ofl
[npm-image]: https://badge.fury.io/js/ofl.svg