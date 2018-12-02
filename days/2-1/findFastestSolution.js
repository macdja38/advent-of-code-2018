const Benchmark = require('benchmark');
const fs = require('fs');


const strings = fs.readFileSync('./data.txt', {encoding: 'utf-8'})
    .split('\n')
    .filter(number => number !== '');

const suit = new Benchmark.Suite;

suit
    .add('a', () => {
        let alphabet = 'abcdefghijklmnopqrstuvwxy'.split("");

        function countNOccurences(string) {
            const counts = alphabet.reduce((acc, letter) => {
                const length = string.split(letter).length - 1;
                if (length === 2) {
                    return acc.two + 1;
                } else if (length === 3) {
                    return acc.three + 1;
                }
                return acc;
            }, {two: 0, three: 0});

            return {two: counts.two > 0 ? 1 : 0, three: counts.two > 0 ? 1 : 0}
        }

        const countResult = strings.reduce((acc, string) => {
                const counts = countNOccurences(string);
                return {two: acc.two + counts.two, three: acc.three + counts.three};
            },
            {two: 0, three: 0});

        return countResult.two * countResult.three;
    })

    .add('b', () => {
        let splitStrings = strings.map(string => string.split(''));

        return splitStrings.find(string => {
            const result2 = splitStrings.find(string2 => {
                if (string.reduce((acc, character, index) => {
                    if (string2[index] !== character) {
                        return acc + 1;
                    }
                    return acc;
                }, 0) === 1) {
                    return string2;
                }
            });
            if (result2) {
                return [string, result2];
            }
        });

    })

    .on('complete', function () {
        for (let i = 0; i < this.length; i++) {
            console.log(String(this[i]));
            console.log(`${this[i].name} achieved a mean of mean ${this[i].stats.mean}s and a cycle speed of ${this[i].hz}ops/sec `);
        }
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        console.log('Slowest is ' + this.filter('slowest').map('name'));
    })

    .run();