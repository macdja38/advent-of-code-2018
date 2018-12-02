const fs = require('fs');
const { sumFrequencies, findFirstFrequencyReachedTwice } = require('./index');
const fastestFrequencies = require('./labeled-while-with-object');

const numbers = fs.readFileSync('./data.txt', {encoding: 'utf-8'})
    .split('\n')
    .map(line => parseInt(line, 10))
    .filter(number => !Number.isNaN(number));

test('sum of frequencies should be correct', () => {
    expect(sumFrequencies(numbers)).toBe(472);
});

test('first frequency reached twice should be correct', () => {
    expect(findFirstFrequencyReachedTwice(numbers)).toBe(66932);
});

test('faster implementation should also be correct.', () => {
    expect(fastestFrequencies(numbers)).toBe(66932);
});