const test = require('ava');
const ofl = require('.');
const {
    KeyTypeError,
    DuplicateError,
    LevelError,
    DelimiterError,
    PatchError,
    SerializableError,
    ObjectError,
} = require('./lib/errors');

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
    t.throws(
        () => ofl.flatten({'a.b': 1}),
        DelimiterError,
        'delimiter in key',
    );
    t.throws(
        () => ofl.flatten({
            a: Object.create(
                Function.prototype,
                {a: {value: 1, enumerable: true}},
            ),
        }),
        ObjectError,
        'non-plain object',
    );
    t.throws(
        () => ofl.flatten({a: {b: {c: [undefined, {}, []]}}}),
        SerializableError,
        '',
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

test('ofl.patch', t => {
    t.deepEqual(
        ofl.patch({a: 1}, {a: 2}),
        {a: 2},
        '',
    );
    t.deepEqual(
        ofl.patch({a: 1, b: 2}, {a: 3}),
        {a: 3, b: 2},
        '',
    );
    t.deepEqual(
        ofl.patch({'a.b.c': 1}, {'a.b.c': 2}),
        {'a.b.c': 2},
        '',
    );
    t.throws(
        () => ofl.patch({a: 1}, {b: 2}),
        PatchError,
        '',
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

test('ofl.validValues', t => {
    t.throws(
        () => ofl.validValues([undefined]),
        SerializableError,
        'no undefined values',
    );
    t.throws(
        () => ofl.validValues([new Date(0)]),
        SerializableError,
        'no impure objects',
    );
    t.throws(
        () => ofl.validValues([[{}]]),
        SerializableError,
        'no object in arrays',
    );
    t.throws(
        () => ofl.validValues([[[]]]),
        SerializableError,
        'no nested arrays',
    );
    t.throws(
        () => ofl.validValues([[undefined]]),
        SerializableError,
        'no undefined in arrays',
    );
    t.notThrows(
        () => ofl.validValues([1, true, null, '', [1, true, null, '']]),
        'all valid types',
    );
});
