const {isObject, isSerializable} = require('easytype');
const {
    DelimiterError,
    SerializableError,
    ObjectError,
} = require('./errors');

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

module.exports = {_flatten, _unflatten};
