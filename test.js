const test = require('ava');
const ofl = require('.');
const {KeyTypeError, DuplicateError, LevelError, SerializableError} = require('./lib/errors');

test('ofl.flatten', t => {
    t.deepEqual(
        ofl.flatten({a: 1, b: true, c: null, d: '', e: [1, true, null, '']}),
        {a: 1, b: true, c: null, d: '', e: [1, true, null, '']},
        'all valid types',
    );
    t.deepEqual(
        ofl.flatten({a: {b: {c: 1}}}),
        {'a.b.c': 1},
        'easy nested object',
    );
    t.deepEqual(
        ofl.flatten({a: {'b.b': {c: 1}}}, '/'),
        {'a/b.b/c': 1},
        'delimiter',
    );
    t.deepEqual(
        ofl.flatten(Object.create(null, {a: {value: 1, enumerable: true}})),
        {a: 1},
        'pure object',
    );
    t.deepEqual(
        ofl.flatten({a: 1, b: {}}),
        {a: 1},
        'empty object in field',
    );
});

test('ofl.unflatten', t => {
    t.deepEqual(
        ofl.unflatten({a: 1, b: true, c: null, d: '', e: [1, true, null, '']}),
        {a: 1, b: true, c: null, d: '', e: [1, true, null, '']},
        'all valid types',
    );
    t.deepEqual(
        ofl.unflatten({'a.b.c': 1}),
        {a: {b: {c: 1}}},
        'easy object',
    );
    t.deepEqual(
        ofl.unflatten({'a/b.b/c': 1}, '/'),
        {a: {'b.b': {c: 1}}},
        'delimiter',
    );
});

test('ofl.validKeys', t => {
    t.throws(
        () => ofl.validKeys([1, null]),
        KeyTypeError,
        'only strings allowed in keys',
    );
    t.throws(
        () => ofl.validKeys(['a', 'a']),
        DuplicateError,
        'no duplicated keys',
    );
    t.throws(
        () => ofl.validKeys(['a', 'a.b']),
        LevelError,
        'no fields added to scalar key',
    );
    t.throws(
        () => ofl.validKeys(['a', 'afc', 'ab'], 'f'),
        LevelError,
        'alpha delimiter',
    );
    t.notThrows(
        () => ofl.validKeys(['a', 'a.b', 'c/d'], '/'),
        'non-alpha delimiter',
    );
});

test('ofl.validObject', t => {
    t.notThrows(
        () => ofl.validObject({a: 1, b: true, c: null, d: ''}),
        'all scalars',
    );
    t.notThrows(
        () => ofl.validObject({a: [1, true, null, '']}),
        'array of scalars',
    );
    t.throws(
        () => ofl.validObject({a: 1, 'a.b': 2}),
        LevelError,
        'no fields added to scalar key',
    );
    t.notThrows(
        () => ofl.validObject({a: 1, 'a.b': 1, 'c/d': 1}, null, '/'),
        'delimiter',
    );
    t.notThrows(
        () => ofl.validObject({a: 1, 'a.b': 1, 'b.c': 1}, 'b'),
        'prefix',
    );
    t.throws(
        () => ofl.validObject({a: undefined}),
        SerializableError,
        'no undefined fields',
    );
    t.throws(
        () => ofl.validObject({a: new Date(0)}),
        SerializableError,
        'no impure objects',
    );
    t.throws(
        () => ofl.validObject({a: [{}]}),
        SerializableError,
        'no object in arrays',
    );
    t.throws(
        () => ofl.validObject({a: [[]]}),
        SerializableError,
        'no nested arrays',
    );
    t.throws(
        () => ofl.validObject({a: [undefined]}),
        SerializableError,
        'no undefined in arrays',
    );
});
