const test = require('ava');
const ofl = require('.');

test('Base API', t => {
    t.deepEqual(
        Object.keys(ofl).sort(),
        [
            'flatten',
            'unflatten',
            'validKeys',
            'validObject',
        ].sort(),
    );
});

test('ofl.flatten', t => {
    t.deepEqual(
        ofl.flatten({a: {b: {c: 1}}}),
        {'a.b.c': 1},
        'easy object',
    );
    t.deepEqual(
        ofl.flatten({a: {'b.b': {c: 1}}}, '/'),
        {'a/b.b/c': 1},
        'delimiter',
    );
    t.throws(
        () => ofl.flatten({a: undefined}),
        'Invalid value type in field a',
        'validObject check for flatten',
    );
});

test('ofl.unflatten', t => {
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
    t.throws(
        () => ofl.unflatten({a: undefined}),
        'Invalid value type in field a',
        'validObject check for unflatten',
    );
});

test('ofl.validKeys', t => {
    t.throws(
        () => ofl.validKeys(['a', 'a']),
        'Duplicated key: a',
        'no duplicated keys',
    );
    t.throws(
        () => ofl.validKeys(['a', 'a.b']),
        'Can not add field to scalar key: a',
        'no fields added to scalar key',
    );
    t.throws(
        () => ofl.validKeys(['a', 'afc', 'ab'], 'f'),
        'Can not add field to scalar key: a',
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
        'Can not add field to scalar key: a',
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
        'Invalid value type in field a',
        'no undefined fields',
    );
    t.throws(
        () => ofl.validObject({a: new Date()}),
        'Invalid value type in field a',
        'no impure objects',
    );
    t.throws(
        () => ofl.validObject({a: [{}]}),
        'Invalid value type in field a',
        'no object in arrays',
    );
    t.throws(
        () => ofl.validObject({a: [[]]}),
        'Invalid value type in field a',
        'no nested arrays',
    );
    t.throws(
        () => ofl.validObject({a: [undefined]}),
        'Invalid value type in field a',
        'no undefined in arrays',
    );
});
