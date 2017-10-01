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
