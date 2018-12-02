const Benchmark = require('benchmark');
const fs = require('fs');

const {findFirstFrequencyReachedTwice} = require('./index');
const findFirstDuplicateObject = require('./labeled-while-with-object');
const findFirstDuplicateArray = require('./labeled-while-with-array');
const findFirstDuplicateSet = require('./labeled-while-with-set');
const findFirstDuplicateMap = require('./labeled-while-with-map');

const numbers = fs.readFileSync('./data.txt', {encoding: 'utf-8'})
    .split('\n')
    .map(line => parseInt(line, 10))
    .filter(number => !Number.isNaN(number));

const suit = new Benchmark.Suite;

suit
    .add('nice code with while loop and set', () => {
        findFirstFrequencyReachedTwice(numbers);
    })

    .add('messy code with object', () => {
        findFirstDuplicateObject(numbers);
    })

    .add('messy code with array', () => {
        findFirstDuplicateArray(numbers);
    })

    .add('messy code with set', () => {
        findFirstDuplicateSet(numbers);
    })

    .add('messy code with map', () => {
        findFirstDuplicateMap(numbers);
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