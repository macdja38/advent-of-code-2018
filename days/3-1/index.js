const fs = require('fs');

const squares = fs.readFileSync('./data.txt', {encoding: 'utf-8'})
    .split('\n')
    .filter(number => number !== '')
    .map(string => {
        const coords = string.split(" ");
        const id = coords[0].slice(1);
        const startingPoints = coords[2].split(",").map(coord => parseInt(coord, 10));
        const size = coords[3].split("x").map(coord => parseInt(coord, 10));
        return {
            id: id,
            startX: startingPoints[0],
            startY: startingPoints[1],
            xSize: size[0],
            ySize: size[1]
        }
    });

const canvas = {};

squares.forEach(({startX, startY, xSize, ySize}) => {
    for (let x = startX; (x - startX) < xSize; x++) {
        for (let y = startY; (y - startY) < ySize; y++) {
            canvas[`${x}-${y}`] = (canvas[`${x}-${y}`] || 0) + 1;
        }
    }
});

console.log(Object.values(canvas).filter(value => value > 1).length);

const nonOverlapping = squares.filter(({startX, startY, xSize, ySize}) => {
    for (let x = startX; (x - startX) < xSize; x++) {
        for (let y = startY; (y - startY) < ySize; y++) {
            if (canvas[`${x}-${y}`] > 1) {
                return false;
            }
        }
    }
    return true;
});

console.log(nonOverlapping);