

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



/* const input = '#..#.#..##......###...###';

const transforms = {
    '...##': '#',
    '..#..': '#',
    '.#...': '#',
    '.#.#.': '#',
    '.#.##': '#',
    '.##..': '#',
    '.####': '#',
    '#.#.#': '#',
    '#.###': '#',
    '##.#.': '#',
    '##.##': '#',
    '###..': '#',
    '###.#': '#',
    '####.': '#',
};*/


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

function getLeftOrFake(pot, n) {
    let pointer = pot;
    for (let i = 0; i < n; i++) {
        if (pointer.prev) {
            pointer = pointer.prev;
        } else {
            return {
                number: pot.number - n,
                contents: '.',
            }
        }
    }
    return pointer;
}

function getRightOrFake(pot, n) {
    let pointer = pot;
    for (let i = 0; i < n; i++) {
        if (pointer.next) {
            pointer = pointer.next;
        } else {
            return {
                number: pot.number + n,
                contents: '.',
            }
        }
    }
    return pointer;
}

function cloneList(pot) {
    let newPot = Object.assign({}, pot);

    let iter = newPot;
    while(iter && iter.next) {
        if (iter && iter.next) {
            iter.next = Object.assign({}, iter.next);
        }
        iter.next.prev = iter;
        iter = iter.next;
    }


    iter = newPot;
    while(iter && iter.prev) {
        if (iter && iter.prev) {
            iter.prev = Object.assign({}, iter.prev);
        }
        iter.prev.next = iter;
        iter = iter.prev;
    }


    return newPot;
}

function goLeft(pot) {
    let iter = pot;
    while(iter.prev) {
        iter = iter.prev;
    }
    return iter;
}

function padRight(pot, n) {
    let pointer = pot;
    while(pointer.next) {
        pointer = pointer.next;
    }
    for (let i = 0; i < n; i++) {
        pointer.next = {
            number: pointer.number + 1,
            contents: '.',
            prev: pointer,
        };
        pointer = pointer.next;
    }
}

function padLeft(pot, n) {
    let pointer = pot;
    while(pointer.prev) {
        pointer = pointer.prev;
    }
    for (let i = 0; i < n; i++) {
        pointer.prev = {
            number: pointer.number - 1,
            contents: '.',
            next: pointer,
        };
        pointer = pointer.prev;
    }
}

function prunePotsAndgoLeft(pot) {
    let iter = pot;
    while(iter.next) {
        iter = iter.next;
    }
    while(iter.contents === '.') {
        iter = iter.prev;
        delete iter.next;
    }

    iter = goLeft(pot);
    while(iter.contents === '.') {
        iter = iter.next;
        delete iter.prev;
    }

    return iter;
}

function checkListCloned(point1, point2) {
    let iter1 = point1;
    let iter2 = point2;
    while(iter1.next || iter2.next) {
        if (!iter1.next) {
            throw new Error('point1 not as long.')
        }
        if (!iter2.next) {
            throw new Error('point2 not as long.')
        }
        if (iter1 === iter2) {
            throw new Error('both iter\'s are same');
        }
        if (iter1.next === iter2.next) {
            throw new Error('both iter\'s next are same');
        }
        if (iter1.prev === iter2.prev) {
            throw new Error('both iter\'s are same');
        }
        iter1 = iter1.next;
        iter2 = iter2.next;
    }
    iter1 = point1;
    iter2 = point2;
    while(iter1.prev || iter2.prev) {
        if (!iter1.prev) {
            throw new Error('point1 not as long.')
        }
        if (!iter2.prev) {
            throw new Error('point2 not as long.')
        }
        if (iter1 === iter2) {
            throw new Error('both iter\'s are same');
        }
        if (iter1.next === iter2.next) {
            throw new Error('both iter\'s next are same');
        }
        if (iter1.prev === iter2.prev) {
            throw new Error('both iter\'s are same');
        }
        iter1 = iter1.prev;
        iter2 = iter2.prev;
    }
}

function logLinkedList(pot) {
    let leftPot = goLeft(pot);
    let sum = '';
    while(leftPot) {
        sum += leftPot.contents;
        leftPot = leftPot.next;
    }
    console.log(sum);
}

function logLinkedListRight(pot) {
    let leftPot = pot;
    let sum = '';
    while(leftPot) {
        sum += leftPot.contents;
        leftPot = leftPot.next;
    }
    console.log(sum);
}


logLinkedList(pot);
let genPots = cloneList(pot);

let output = '';

let deltaLastFive = [];

console.time('50000');
for (let gen = 0; gen < 50000; gen++) {
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
    genPots = prunePotsAndgoLeft(newPots);

    let endPoints = calcPoints(genPots);
    deltaLastFive.push(endPoints - startPoints);
    if (deltaLastFive.length > 5) {
        deltaLastFive.shift();
        let areSame = deltaLastFive.reduce((lastOrFalse, delta) => delta === lastOrFalse ? delta : false);
        if (areSame) {
            console.log(deltaLastFive);
            console.log(endPoints);
            console.log(gen + 1);
            break;
        }
    }

}
console.timeEnd('50000');

require('fs').writeFileSync('./output.txt', output);


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