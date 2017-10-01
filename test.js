const test = require('ava');
const ofl = require('.');

test('Base API', t => {
    t.deepEqual(
        Object.keys(ofl).sort(),
        [
            'flatten',
            'unflatten',
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
