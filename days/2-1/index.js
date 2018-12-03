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

let splitStrings = strings.map(string => {
    const firstHalfLength = Math.floor(string.length / 2);

    return [string.slice(0, firstHalfLength), string.slice(firstHalfLength)]
});

let firstToSecond = {};
let secondToFirst = {};

splitStrings.forEach(([firstHalf, secondHalf]) => {
    const firstHalfValue = (firstToSecond[firstHalf] || []);
    firstHalfValue.push(secondHalf);
    firstToSecond[firstHalf] = firstHalfValue;
    const secondHalfValue = (secondToFirst[secondHalf] || []);
    secondHalfValue.push(firstHalf);
    secondToFirst[secondHalf] = secondHalfValue;
});

let answer = [];
splitStrings.some(([firstHalf, secondHalf]) => {

    const result2 = firstToSecond[firstHalf].some(secondHalfTry => {
        if (secondHalfTry.split('').reduce((acc, character, index) => {
            if (secondHalf[index] !== character) {
                return acc + 1;
            }
            return acc;
        }, 0) === 1) {
            answer.push(firstHalf, secondHalfTry, secondHalfTry);
            return true;
        }
    });

    if (result2) {
        return true;
    }

    const result3 = secondToFirst[secondHalf].some(firstHalfTry => {
        if (firstHalfTry.split('').reduce((acc, character, index) => {
            if (firstHalf[index] !== character) {
                return acc + 1;
            }
            return acc;
        }, 0) === 1) {
            answer.push(firstHalf, firstHalfTry, secondHalf);
            return true;
        }
    });

    if (result3) {
        return true;
    }
});

console.log(answer);