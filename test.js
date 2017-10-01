const test = require('ava');
const ofl = require('.');

test('Base API', t => {
    t.deepEqual(
        Object.keys(ofl).sort(),
        [
            'flatten',
            'unflatten',
            'validKeys',
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
        ofl.flatten({b: {c: 1}}, 'a'),
        {'a.b.c': 1},
        'prefix',
    );
    t.deepEqual(
        ofl.flatten({a: {'b.b': {c: 1}}}, null, '/'),
        {'a/b.b/c': 1},
        'delimiter',
    );
});

test('ofl.unflatten', t => {
    t.deepEqual(
        ofl.unflatten({'a.b.c': 1}),
        {a: {b: {c: 1}}},
        'easy object',
    );
    t.deepEqual(
        ofl.unflatten({'a.b.c': 1}, 'a'),
        {b: {c: 1}},
        'prefix',
    );
    t.deepEqual(
        ofl.unflatten({'a/b.b/c': 1}, null, '/'),
        {a: {'b.b': {c: 1}}},
        'delimiter',
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
    t.notThrows(
        () => ofl.validKeys(['a', 'a.b', 'c/d'], '/'),
        'delimiter',
    );
});
