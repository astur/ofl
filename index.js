const {DuplicateError, LevelError, SerialisableError} = require('./lib/errors');
const type = v => ({}).toString.call(v).slice(8, -1);
const isObject = v => type(v) === 'Object';
const isScalar = v => ['Boolean', 'Null', 'Number', 'String'].includes(type(v));
const isValid = v => isScalar(v) || type(v) === 'Array' && v.every(isScalar);

const validKeys = (keys, delimiter = '.') => {
    keys.forEach((key, i, arr) => {
        if(i !== arr.indexOf(key)) throw new DuplicateError(key);
        if(arr.some(v => v.startsWith(`${key}${delimiter}`))) throw new LevelError(key);
    });
};

const validValues = values => {
    values.forEach(v => {
        if(!isValid(v)) throw new SerialisableError(v);
    });
};

const validObject = (obj, delimiter = '.') => {
    validKeys(Object.keys(obj), delimiter);
    validValues(Object.values(obj));
};

const _flatten = (obj, prefix = '', delimiter = '.') => {
    const result = {};

    Object.keys(obj).sort().forEach(key => {
        const flatKey = prefix ? prefix + delimiter + key : key;

        if(isObject(obj[key])){
            Object.assign(result, _flatten(obj[key], flatKey, delimiter));
        } else {
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

const flatten = (obj, delimiter = '.') => {
    const result = _flatten(obj, '', delimiter);
    validObject(result, delimiter);
    return result;
};

const unflatten = (obj, delimiter = '.') => {
    validObject(obj, delimiter);
    return _unflatten(obj, '', delimiter);
};

module.exports = {flatten, unflatten, validKeys, validValues, validObject};
