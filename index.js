const {
    KeyTypeError,
    DuplicateError,
    LevelError,
    PatchError,
    SerializableError,
} = require('./lib/errors');

const {_flatten, _unflatten} = require('./lib/plumbing');

const {isString, isSerializable} = require('easytype');

const validKeys = (keys, delimiter = '.') => keys.forEach((key, i, arr) => {
    if(!isString(key)) throw new KeyTypeError(key);
    if(i !== arr.indexOf(key)) throw new DuplicateError(key);
    if(arr.some(v => v.startsWith(`${key}${delimiter}`))) throw new LevelError(key);
});

const validValues = values => {
    values.forEach(v => {
        if(!isSerializable(v)) throw new SerializableError(v);
    });
};

const flatten = (obj, delimiter = '.') => _flatten(obj, '', delimiter);

const unflatten = (obj, delimiter = '.') => {
    validKeys(Object.keys(obj), delimiter);
    validValues(Object.values(obj));
    return _unflatten(obj, '', delimiter);
};

const patch = (obj, diff) => {
    Object.keys(diff).forEach(key => {
        if(!(key in obj)) throw new PatchError(key);
    });
    return Object.assign({}, obj, diff);
};

module.exports = {flatten, unflatten, patch, validKeys, validValues};
