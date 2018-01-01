const ce = require('c-e');
const inspect = require('util').inspect;

const KeyError = ce('KeyError');
const ValueError = ce('ValueError');

const KeyTypeError = ce('KeyTypeError', KeyError, function(key){
    this.message = `Invalid type of key: ${key}`;
});
const DuplicateError = ce('DuplicateError', KeyError, function(key){
    this.message = `Duplicated key: ${key}`;
});
const LevelError = ce('LevelError', KeyError, function(key){
    this.message = `Can not add field to non-object key: ${key}`;
});
const DelimiterError = ce('DelimiterError', KeyError, function(key){
    this.message = `Delimiter in key string: ${key}`;
});
const ObjectError = ce('ObjectError', ValueError, function(obj){
    this.message = `Object is not plain`;
    this.object = obj;
});
const SerializableError = ce('SerializableError', ValueError, function(value){
    this.message = `Invalid type of value: ${inspect(value)}`;
});

module.exports = {
    KeyTypeError,
    DuplicateError,
    LevelError,
    DelimiterError,
    SerializableError,
    ObjectError,
};
