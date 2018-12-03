const fs = require('fs');

const strings = fs.readFileSync('./data.txt', {encoding: 'utf-8'})
    .split('\n')
    .filter(number => number !== '');

// a

let alphabet = 'abcdefghijklmnopqrstuvwxy'.split("");

function countNOccurences(n, string) {
    return alphabet.reduce((acc, letter) => {
        if (string.split(letter).length - 1 === n) {
            return acc + 1;
        }
        return acc;
    }, 0) > 0 ? 1 : 0;
}

const x3 = strings.reduce((acc, string) => acc + countNOccurences(3, string), 0);
const x2 = strings.reduce((acc, string) => acc + countNOccurences(2, string), 0);

console.log(x3 * x2);

// b

strings.some(string => {
    return strings.some(string2 => {
        if (string.split('').reduce((acc, character, index) => {
            if (string2[index] !== character) {
                return acc + 1;
            }
            return acc;
        }, 0) === 1) {
            console.log(string, string2);
            return true;
        }
    })
});

// that last solution was like O(n^2) or something crazy, we can do better... this is... I'm not sure what this is
// but it's definitely much better.

// it also outputs the difference in a really confusing format

// create a mapping of first half of the string to second half, and second half to first half

let splitStrings = strings.map(string => {
    const firstHalfLength = Math.floor(string.length / 2);

    return [string.slice(0, firstHalfLength), string.slice(firstHalfLength)]
});

let firstToSecond = {};
let secondToFirst = {};

splitStrings.forEach(([firstHalf, secondHalf]) => {
    const firstHalfValue = (firstToSecond[firstHalf] || []);
    firstHalfValue.push(secondHalf.split(''));
    firstToSecond[firstHalf] = firstHalfValue;
    const secondHalfValue = (secondToFirst[secondHalf] || []);
    secondHalfValue.push(firstHalf.split(''));
    secondToFirst[secondHalf] = secondHalfValue;
});

// loop through the split strings, and using the first half search through the possible second halves
// then if nothing is found that's exactly one char off use the 2nd half to search through the first half.
// basically we take advantage of the fact that the correct solution is only one character off, which means that
// either the first or second half of the two id's that make up the correct solution need to be the same
// so build an index with both was the previous step, this step is use those indexes to find values that are one different

let answer = [];
splitStrings.some(([firstHalf, secondHalf]) => {

    const firstHalfSplit = firstHalf.split('');
    const secondHalfSplit = secondHalf.split('');

    const result2 = firstToSecond[firstHalf].some(secondHalfTry => {
        if (secondHalfTry.reduce((acc, character, index) => {
            if (secondHalfSplit[index] !== character) {
                return acc + 1;
            }
            return acc;
        }, 0) === 1) {
            answer.push(firstHalf, secondHalfTry, secondHalfSplit);
            return true;
        }
    });

    if (result2) {
        return true;
    }

    const result3 = secondToFirst[secondHalf].some(firstHalfTry => {
        if (firstHalfTry.reduce((acc, character, index) => {
            if (firstHalfSplit[index] !== character) {
                return acc + 1;
            }
            return acc;
        }, 0) === 1) {
            answer.push(firstHalfSplit, firstHalfTry, secondHalf);
            return true;
        }
    });

    if (result3) {
        return true;
    }
});

console.log(answer);