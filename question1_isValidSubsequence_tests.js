
const {
    isValidSubsequence,
} = require('./question1_isValidSubsequence');

[
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [1, 6, -1, 10]
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 25, 6, -1, 8, 10]
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 6, -1, 8, 10]
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [22, 25, 6]
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [1, 6, 10]
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 10]
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, -1, 8, 10]
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [25]
    },
    {
        "array": [1, 1, 1, 1, 1],
        "sequence": [1, 1, 1]
    },
    {
        "array": [],
        "sequence": [1, 1, 1],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 25, 6, -1, 8, 10, 12],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [4, 5, 1, 22, 25, 6, -1, 8, 10],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 23, 6, -1, 8, 10],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 22, 25, 6, -1, 8, 10],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 22, 6, -1, 8, 10],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [1, 6, -1, -1],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [1, 6, -1, -1, 10],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [1, 6, -1, -2],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [26],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 25, 22, 6, -1, 8, 10],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 26, 22, 8],
        "result": false
    },
    {
        "array": [1, 1, 6, 1],
        "sequence": [1, 1, 1, 6],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [1, 6, -1, 10, 11, 11, 11, 11],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [5, 1, 22, 25, 6, -1, 8, 10, 10],
        "result": false
    },
    {
        "array": [5, 1, 22, 25, 6, -1, 8, 10],
        "sequence": [1, 6, -1, 5],
        "result": false
    }
].forEach(test => {
    const { result = true } = test;

    if (isValidSubsequence(test.array, test.sequence) !== result) {
        throw new Error('Test failed');
    }
});
