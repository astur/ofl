const {
    KeyTypeError,
    DuplicateError,
    LevelError,
    DelimiterError,
    PatchError,
    SerializableError,
    ObjectError,
} = require('./lib/errors');
const {isString, isObject, isSerializable} = require('easytype');

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

const _flatten = (obj, prefix = '', delimiter = '.') => {
    const result = {};

    Object.keys(obj).sort().forEach(key => {
        if(key.includes(delimiter)) throw new DelimiterError(key);

        const flatKey = prefix ? prefix + delimiter + key : key;

        if(isObject(obj[key])){
            if(!isObject.plain(obj[key])) throw new ObjectError(obj[key]);
            Object.assign(result, _flatten(obj[key], flatKey, delimiter));
        } else {
            if(!isSerializable(obj[key])) throw new SerializableError(obj[key]);
            result[flatKey] = obj[key];
        }
    });

    return result;
};

const _unflatten = (obj, prefix = '', delimiter = '.') => {
    const result = {};
    const nested = new Set();
    const keys = Object.keys(obj).sort()
        .filter(v => prefix ? v.startsWith(prefix + delimiter) : true);

    for(const k of keys){
        const key = prefix ? k.slice((prefix + delimiter).length) : k;
        if(key.indexOf(delimiter) === -1){
            result[key] = obj[k];
        } else {
            nested.add(key.split(delimiter)[0]);
        }
    }

    for(const k of nested){
        result[k] = _unflatten(obj, prefix ? prefix + delimiter + k : k, delimiter);
    }

    return result;
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
