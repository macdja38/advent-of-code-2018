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

strings.forEach(string => {
    strings.forEach(string2 => {
        if (string.split('').reduce((acc, character, index) => {
            if (string2[index] !== character) {
                return acc + 1;
            }
            return acc;
        }, 0) === 1) {
            console.log(string, string2);
        }
    })
});
