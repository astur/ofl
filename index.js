const type = v => ({}).toString.call(v).slice(8, -1);
const isObject = v => type(v) === 'Object';
const isScalar = v => ['Boolean', 'Null', 'Number', 'String'].includes(type(v));
const isValid = v => isScalar(v) || type(v) === 'Array' && v.every(isScalar);
const prefixFilter = (a, p) => p ? a.filter(v => v.startsWith(p)) : a;

const validKeys = (keys, delimiter = '.') => {
    keys.sort();

    for(let i = 1, l = keys.length; i < l; i++){
        if(keys[i] === keys[i - 1]){
            throw new Error(`Duplicated key: ${keys[i]}`);
        }
        if(keys[i].startsWith(keys[i - 1] + delimiter)){
            throw new Error(`Can not add field to scalar key: ${keys[i - 1]}`);
        }
    }
};

const validObject = (obj, prefix = '', delimiter = '.') => {
    const keys = prefixFilter(Object.keys(obj), prefix ? prefix + delimiter : '');

    validKeys(keys, delimiter);
    keys.forEach(key => {
        if(!isValid(obj[key])){
            throw new Error(`Invalid value type in field ${key}`);
        }
    });
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

    if(keys.some(k => isObject(obj[k]))) return null;

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

const flatten = (obj, prefix = '', delimiter = '.') => {
    const result = _flatten(obj, prefix, delimiter);
    validObject(result, prefix, delimiter);
    return result;
};

const unflatten = (obj, prefix = '', delimiter = '.') => {
    validObject(obj, prefix, delimiter);
    return _unflatten(obj, prefix, delimiter);
};

module.exports = {flatten, unflatten, validKeys, validObject};
