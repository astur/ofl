const isObject = value => ({}).toString.call(value) === '[object Object]';

const flatten = (obj, prefix='', delimiter='.') => {
    const result = {};

    Object.keys(obj).sort().forEach(key => {
        const flatKey = !prefix ? key : prefix + delimiter + key;

        if(isObject(obj[key])){
            Object.assign(result, flatten(obj[key], flatKey, delimiter));
        } else {
            result[flatKey] = obj[key];
        }
    });

    return result;
};

const unflatten = (obj, prefix='', delimiter='.') => {
    const result = {};
    const nested = new Set();
    const keys = Object.keys(obj).sort()
        .filter(v => !prefix ? true : v.startsWith(prefix + delimiter));

    if(keys.some(k => isObject(obj[k]))) return null;

    for(let k of keys){
        const key = prefix ? k.slice((prefix + delimiter).length) : k;
        if(key.indexOf(delimiter) === -1){
            result[key] = obj[k];
        } else {
            nested.add(key.split(delimiter)[0]);
        }
    }

    for(let k of nested){
        result[k] = unflatten(obj, !prefix ? k : prefix + delimiter + k, delimiter);
    }

    return result;
}

module.exports = {flatten, unflatten};