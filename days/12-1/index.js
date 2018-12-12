// yea... hard coded input, I know.
const input = '###.......##....#.#.#..###.##..##.....#....#.#.....##.###...###.#...###.###.#.###...#.####.##.#....#';

const transforms = {
    '.....': '.',
    '#..##': '.',
    '..###': '#',
    '..#.#': '#',
    '.#.#.': '.',
    '####.': '.',
    '##.##': '#',
    '#....': '.',
    '#...#': '.',
    '...##': '.',
    '##..#': '.',
    '.###.': '#',
    '#####': '#',
    '#.#..': '#',
    '.##..': '#',
    '.#.##': '.',
    '...#.': '#',
    '#.##.': '#',
    '..#..': '#',
    '##...': '#',
    '....#': '.',
    '###.#': '#',
    '#..#.': '#',
    '#.###': '#',
    '##.#.': '.',
    '###..': '#',
    '.####': '.',
    '.#...': '#',
    '..##.': '.',
    '.##.#': '.',
    '#.#.#': '#',
    '.#..#': '.',
};

const {
    getLeftOrFake,
    getRightOrFake,
    cloneList,
    goLeft,
    padRight,
    padLeft,
    pruneAndGoLeft,
} = require('./linkedListUtils');

const list = input.split('');

let pot;

for (let [index, contents] of Object.entries(list)) {
    let numIndex = parseInt(index, 10);
    if (!pot) {
        pot = {
            number: numIndex,
            contents,
        };
        continue;
    }
    pot.next = {
        prev: pot,
        number: numIndex,
        contents,
    };
    pot = pot.next;
}

function calcPoints(pot) {
    let leftPot = goLeft(pot);
    let sum = 0;
    while(leftPot) {
        if (leftPot.contents === '#') {
            sum += leftPot.number;
        }
        leftPot = leftPot.next;
    }
    return sum;
}

let genPots = cloneList(pot);

let output = '';

let deltaLastFive = [];

console.time('50000');

let m;
let b;
let valueAtTwenty;

for (let gen = 0; true; gen++) {
    output += gen + ', ' + calcPoints(genPots) + '\n';
    let startPoints = calcPoints(genPots);

    padLeft(genPots, 4);
    padRight(genPots, 4);
    let newPots = cloneList(genPots);

    let genPointer = goLeft(genPots);
    let newPointer = goLeft(newPots);

    // logLinkedList(newPointer);
    while(newPointer.next) {
        genPointer = genPointer.next;
        newPointer = newPointer.next;
        let potString = getLeftOrFake(genPointer, 2).contents + getLeftOrFake(genPointer, 1).contents + genPointer.contents + getRightOrFake(genPointer, 1).contents + getRightOrFake(genPointer, 2).contents;
        // console.log(potString, " => ", genPointer.contents, transforms[potString]);
        newPointer.contents = transforms[potString] || '.';
    }
    genPots = pruneAndGoLeft(newPots);

    let endPoints = calcPoints(genPots);
    deltaLastFive.push(endPoints - startPoints);
    if (gen + 1 === 20) {
        valueAtTwenty = endPoints;
    }
    if (deltaLastFive.length > 5) {
        deltaLastFive.shift();
        let areSame = deltaLastFive.reduce((lastOrFalse, delta) => delta === lastOrFalse ? delta : false);
        if (areSame) {
            m = deltaLastFive[0];
            b = endPoints - ((gen + 1) * m);
            break;
        }
    }

}

console.log('part 1', valueAtTwenty);
console.log('part 2', (50 * 10 ** 9) * m + b);