const ce = require('c-e');
const inspect = require('util').inspect;

const KeyError = ce('KeyError');
const ValueError = ce('ValueError');

const DuplicateError = ce('DuplicateError', KeyError, function(key){
    this.message = `Duplicated key: ${key}`;
});
const LevelError = ce('LevelError', KeyError, function(key){
    this.message = `Can not add field to non-object key: ${key}`;
});
const SerialisableError = ce('SerialisableError', ValueError, function(value){
    this.message = `Invalid type of value: ${inspect(value)}`;
});

module.exports = {DuplicateError, LevelError, SerialisableError};