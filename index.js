const isObject = value => ({}).toString.call(value) === '[object Object]';

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

const flatten = (obj, prefix = '', delimiter = '.') => {
    const result = {};

    Object.keys(obj).sort().forEach(key => {
        const flatKey = prefix ? prefix + delimiter + key : key;

        if(isObject(obj[key])){
            Object.assign(result, flatten(obj[key], flatKey, delimiter));
        } else {
            result[flatKey] = obj[key];
        }
    });

    return result;
};

const unflatten = (obj, prefix = '', delimiter = '.') => {
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
        result[k] = unflatten(obj, prefix ? prefix + delimiter + k : k, delimiter);
    }

    return result;
};

module.exports = {flatten, unflatten, validKeys};
