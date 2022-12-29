// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const compareTwoArrays = (a, b, maxDepth = 5) => {
    if (!Array.isArray(a) || !Array.isArray(b)) {
        throw new Error('One of the arguments is not an array!');
    }
    if (typeof maxDepth !== 'number' || Number.isNaN(maxDepth)) {
        throw new Error('Maximum depth is not a number!');
    }
    if (maxDepth < 0) {
        throw new Error('Maximum depth exceeded!');
    }
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
            if (!compareTwoArrays(a[i], b[i], maxDepth - 1)) {
                return false;
            }
        } else if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};

const areEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return compareTwoArrays(a, b);
    }
    return a === b;
};

const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value) => {
    return typeof value;
};

const getTypesOfItems = (arr) => {
    return arr.map(getType);
};

const allItemsHaveTheSameType = (arr) => {
    const set = new Set(getTypesOfItems(arr));

    if (set.size === 1) {
        return true;
    }
    return false;
};

const getRealType = (value) => {
    const type = getType(value);

    if (type === 'object') {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    }

    if (type === 'number' && !Number.isFinite(value)) {
        return value.toString();
    }
    return type;
};

const getRealTypesOfItems = (arr) => {
    return arr.map(getRealType);
};

const everyItemHasAUniqueRealType = (arr) => {
    const set = new Set(getRealTypesOfItems(arr));
    return set.size === arr.length;
};

const countRealTypes = (arr) => {
    const result = arr.reduce((acc, value) => {
        const type = getRealType(value);

        if (acc[type] != null) {
            acc[type] += 1;
        } else {
            acc[type] = 1;
        }

        return acc;
    }, {});
    return Object.entries(result).sort((a, b) => {
        if (a[0] > b[0]) {
            return 1;
        }
        if (a[0] < b[0]) {
            return -1;
        }
        return 0;
    });
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('NaN', getType(NaN), 'number');
test('Infinity', getType(Infinity), 'number');
test('-Infinity', getType(-Infinity), 'number');
test('BigInt', getType(9007199254740991n), 'bigint');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');
test('Symbol', getType(Symbol('test')), 'symbol');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);

test('All values are number but wait', allItemsHaveTheSameType([11, new Number(12), 13]), false);

test('All values are boolean but wait', allItemsHaveTheSameType([false, new Boolean(true), false]), false);

test(
    'Values like a number',
    allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]),
    true
);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    true,
    123,
    NaN,
    Infinity,
    -Infinity,
    9007199254740991n,
    'test',
    function () {},
    undefined,
    null,
    [1, 2, 3],
    {},
    new Date(),
    /ab+c/,
    new Set(),
    new Map(),
    new Error(),
    Symbol('test'),
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'number',
    'number',
    'number',
    'bigint',
    'string',
    'function',
    'undefined',
    'object',
    'object',
    'object',
    'object',
    'object',
    'object',
    'object',
    'object',
    'symbol',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'NaN',
    'Infinity',
    '-Infinity',
    'bigint',
    'string',
    'function',
    'undefined',
    'null',
    'array',
    'object',
    'date',
    'regexp',
    'set',
    'map',
    'error',
    'symbol',
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

testBlock('compareTowArrays');

test('Two arrays are not equal (length)', compareTwoArrays([1, 2, 3], [1, 2, 3, 4]), false);

test('Two arrays are not equal (value)', compareTwoArrays([1, 2, 3], [1, 2, 4]), false);

test('Two arrays are equal (value)', compareTwoArrays([1, 2, 3], [1, 2, 3]), true);

const a = [1, 2, 3];
const b = [1, 2, 4];

test('Two arrays are equal (reference)', compareTwoArrays(a, a), true);

test(
    'Two multidimensional arrays are not equal',
    compareTwoArrays(
        [
            [1, [7]],
            [[3, [8]], a],
            [b, 6],
        ],
        [
            [1, [7]],
            [[3, [9]], a],
            [b, 6],
        ]
    ),
    false
);

test(
    'Two multidimensional arrays are equal',
    compareTwoArrays(
        [
            [1, [7]],
            [[3, [8]], a],
            [b, 6],
        ],
        [
            [1, [7]],
            [[3, [8]], a],
            [b, 6],
        ]
    ),
    true
);
