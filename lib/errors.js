const ce = require('c-e');

const KeyError = ce('KeyError');
const ValueError = ce('ValueError');

const DuplicateError = ce('DuplicateError', KeyError);
const LevelError = ce('LevelError', KeyError);
const SerialisableError = ce('SerialisableError', ValueError);

module.exports = {DuplicateError, LevelError, SerialisableError};
