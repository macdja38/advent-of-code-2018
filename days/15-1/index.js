const fs = require('fs');

const data = fs.readFileSync('./data.txt', {encoding: 'utf-8'});

const UNITS = {
    CAVERN: '#',
    ELF: 'E',
    GOBLIN: 'G',
    WALL: '#',
};

const cardinalDirections = [[-1, 0], [0, -1], [0, 1], [1, 0]];

function parseData(data) {
    return data.split('\n')
        .map(line => line
            .split('')
            .map(symbol => {
                switch (symbol) {
                    case 'G':
                        return {
                            unit: UNITS.GOBLIN,
                            health: 200,
                            attack: 3,
                        };
                    case 'E':
                        return {
                            unit: UNITS.ELF,
                            health: 200,
                            attack: 3,
                        };
                    case '#':
                        return {
                            unit: UNITS.WALL,
                        };
                    case '.':
                        return null;
                    default:
                        throw new Error(`Invalid symbol ${symbol} mapped.`)
                }
            }));

}

const map = parseData(data);

function printMap(map) {
    console.log(map
        .map(line => {
            let units = [];
            return line.map(entry => {
                    if (entry) {
                        if (entry.unit === UNITS.GOBLIN || entry.unit === UNITS.ELF) {
                            units.push(entry);
                        }
                        return entry.unit;
                    }
                    return '.';
                }).join('')
                + '    '
                + units.map(unit => `${unit.unit}(${unit.health})`).join(', ');
        }).join('\n'));
}

function numberToLastDigit(number) {
    if (number === Infinity) {
        return ' ';
    }
    const string = number.toString();

    return string[string.length - 1];
}

function printPathNumbers(mapClone) {
    console.log(mapClone
        .map(line => line
            .map(entry => entry
                ? numberToLastDigit(entry.distance)
                : '#')
            .join(''))
        .join('\n'));
}

function isfunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

function cloneAndFill(map, fill) {
    return map.map((line, y) => line.map((tile, x) => {
        if (isfunction(fill)) {
            return fill(tile, y, x);
        }
        if (fill) {
            return Object.assign({}, fill);
        }
        return Object.assign({}, tile);
    }));
}

function shallowClone(map) {
    return map.map(line => line.map(tile => tile));
}

function findShortestPathDepthFirst({x: startX, y: startY}, {x: endX, y: endY}, map) {

    // create a map of all the free places in the cavern, considering our current location free.
    let mapClone = cloneAndFill(map, (tile, y, x) => {
        if (tile === null || (y === startY && x === startX)) {
            return {distance: Infinity, pathsFromStart: []}
        }
        return null;
    });

    function testMove(depth, x, y, path) {
        let tile = mapClone[y][x];

        if (tile === null) {
            return null;
        }

        if (tile.distance === depth) {
            tile.pathsFromStart.push(path);
        } else if (depth < tile.distance) {
            tile.pathsFromStart = [path];
            tile.distance = depth;
        } else {
            return false;
        }
        // printPathNumbers(mapClone);

        if (x === endX && y === endY) {
            return true;
        }

        for (const [xOffset, yOffset] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
            testMove(depth + 1, x + xOffset, y + yOffset, [...path, x, y])
        }
    }

    testMove(0, startX, startY, []);
    printPathNumbers(mapClone);
    return mapClone[endY][endX];
}

function findPathLengthBreadthFirst({x: startX, y: startY}, {x: endX, y: endY}, map) {

    // create a map of all the free places in the cavern, considering our current location free.
    let mapClone = cloneAndFill(map, (tile, y, x) => {
        if (tile === null || (y === startY && x === startX)) {
            return {distance: Infinity}
        }
        return null;
    });

    let nodeQueue = [{depth: 0, x: startX, y: startY}];

    while (nodeQueue.length > 0) {
        const {depth, x, y} = nodeQueue.shift();

        let tile = mapClone[y][x];

        if (tile === null) {
            continue;
        }

        if (depth < tile.distance) {
            tile.distance = depth;
        } else {
            continue;
        }

        if (x === endX && y === endY) {
            // continue;
        }

        for (const [yOffset, xOffset] of cardinalDirections) {
            nodeQueue.push({depth: depth + 1, x: x + xOffset, y: y + yOffset});
        }
    }

    const endNode = mapClone[endY][endX];
    if (endNode) {
        return endNode.distance;
    } else {
        return Infinity;
    }
}

function findFirstStep({x: startX, y: startY}, destination, map) {
    let firstStep = null;
    let firstStepDistance = Infinity;

    if (startY === destination.y && startX === destination.x) {
        return {distance: 0, firstStep};
    }

    for (const [yOffset, xOffset] of cardinalDirections) {
        const x = startX + xOffset;
        const y = startY + yOffset;
        if (map[y][x] !== null) {
            continue;
        }
        const length = findPathLengthBreadthFirst({x, y}, destination, map);
        if (length < firstStepDistance) {
            firstStep = [yOffset, xOffset];
            firstStepDistance = length;
        }
    }
    return {distance: firstStepDistance + 1, firstStep};
}

// printMap(map);
// console.log(findPathLengthBreadthFirst({x: 21, y: 11}, {x: 22, y: 19}, map));
// console.log(findFirstStep({x: 21, y: 11}, {x: 22, y: 19}, map));
// console.log(findFirstStep({x: 21, y: 11}, {x: 22, y: 12}, map));

function countTypeHP(map, type) {
    return map.flat().filter(entry => entry && entry.unit === type).reduce((acc, unit) => acc + unit.health, 0);
}

function getTargetsOfType(map, type) {
    return map.map((line, y) => {
        return line.map((tile, x) => {
            if (tile && tile.unit === type) {
                return cardinalDirections.map(([yOffset, xOffset]) => {
                    if (map[y + yOffset][x + xOffset] === null) {
                        return {x: x + xOffset, y: y + yOffset};
                    }
                });
            }
        })
    }).flat(5).filter(entry => entry);
}

function getUnitMove(map, y, x, type) {
    const targets = getTargetsOfType(map, type);
    let closestTargetDistance = Infinity;
    let nextMove = null;
    for (let target of targets) {
        const firstStep = findFirstStep({x, y}, {x: target.x, y: target.y}, map);
        if (closestTargetDistance === 1) {
            // console.log('what');
        }
        if (firstStep.distance < closestTargetDistance) {
            nextMove = firstStep.firstStep;
            closestTargetDistance = firstStep.distance;
        }
    }

    return {distance: closestTargetDistance, firstStep: nextMove}
}

function getEnemyType(type) {
    switch (type) {
        case UNITS.GOBLIN:
            return UNITS.ELF;
        case UNITS.ELF:
            return UNITS.GOBLIN;
        default:
            throw new Error('Invalid type ${type} supplied.')
    }
}

function findMostDeadAdjecentTarget(map, y, x, type) {
    let lowestHealth = Infinity;
    let targetX;
    let targetY;
    let target = null;

    for (let [yOffset, xOffset] of cardinalDirections) {
        let possibleTargetY = y + yOffset;
        let possibleTargetX = x + xOffset;
        const possibleTarget = map[possibleTargetY][possibleTargetX];
        if (possibleTarget && possibleTarget.unit === type) {
            // we are adjacent to an enemy, attack then and end our turn.
            if (possibleTarget.health < lowestHealth) {
                lowestHealth = possibleTarget.health;
                target = possibleTarget;
                targetX = possibleTargetX;
                targetY = possibleTargetY;
            }

        }
    }

    if (target) {
        return {x: targetX, y: targetY, tile: target}
    }
    return false;
}

function countType(map, type) {
    return map.flat().filter(entry => entry && entry.unit === type).reduce((acc) => acc + 1, 0);
}

let rounds = 0;
while (true) {
    let loopMap = shallowClone(map);
    loopMap.forEach((line, y) => {
        line.forEach((turnStartTile, x) => {
            // if we didn't start the turn in this place we already moved or someone replaced us.
            if (map[y][x] !== turnStartTile) return;
            // empty tiles don't do things
            if (turnStartTile === null) return;
            // walls don't do things
            if (turnStartTile.unit === UNITS.WALL) return;

            const type = turnStartTile.unit;
            const enemy = getEnemyType(type);

            let newX = x;
            let newY = y;

            // we were not adjacent to an enemy, let's try to move towards one
            const isInRange = !!findMostDeadAdjecentTarget(map, y, x, enemy);

            if (!isInRange) {
                const move = getUnitMove(map, y, x, enemy);

                if (move && move.distance < Infinity) {
                    // console.log(move);
                    map[y][x] = null;
                    newY = y + move.firstStep[0];
                    newX = x + move.firstStep[1];
                    map[newY][newX] = turnStartTile;
                }
            }

            const target = findMostDeadAdjecentTarget(map, newY, newX, enemy);

            if (target) {
                console.log(`${type} attacks ${target.tile.unit}`);

                target.tile.health -= turnStartTile.attack;

                // if the enemy dies we remove them from the map
                if (target.tile.health <= 0) {
                    console.log(`${type} kills ${target.tile.unit} at ${target.y} ${target.x}`);
                    map[target.y][target.x] = null;
                }
            }

        })
    });

    const goblinHealth = countTypeHP(map, UNITS.GOBLIN);
    const elfHealth = countTypeHP(map, UNITS.ELF);

    console.log(goblinHealth, elfHealth);
    if (elfHealth <= 0) {
        console.log(`Goblins with with ${goblinHealth} health after ${rounds} rounds. Solution ${goblinHealth * rounds}`);
        break;
    }
    if (goblinHealth <= 0) {
        console.log(`Elves with with ${elfHealth} health after ${rounds} rounds. Solution ${elfHealth * rounds}`);
        break;
    }
    rounds++;
    // TODO: account for the possibility of a round completing with the last character's move.
}