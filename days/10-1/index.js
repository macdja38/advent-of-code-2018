const fs = require("fs");

const text = fs.readFileSync('./data.txt', {encoding: 'utf-8'});

function textToMaps(text) {
    const regexpr = /^position=<(?<positionX>.+), (?<positionY>.+)> velocity=<(?<velocityX>.+), (?<velocityY>.+)>/gm;
    let match;
    let points = [];
    while ((match = regexpr.exec(text)) != null) {
        points.push({
            positionX: parseInt(match.groups.positionX, 10),
            positionY: parseInt(match.groups.positionY, 10),
            velocityX: parseInt(match.groups.velocityX, 10),
            velocityY: parseInt(match.groups.velocityY, 10),
        });
    }
    return points;
}

let points = textToMaps(text);

function simulateTick(points) {
    return points.map(point => ({
        positionX: point.positionX + point.velocityX,
        positionY: point.positionY + point.velocityY,
        velocityX: point.velocityX,
        velocityY: point.velocityY,
    }))
}

function printMap(points) {
    const { xOffset, yOffset, xMax, yMax } = getGraphAxis(points);
    console.log(xOffset, yOffset, yMax, xMax);

    const map = Array.from({length: yMax - yOffset + 1}, () => Array.from({length: xMax - xOffset + 1}, () => '.'));

    for (let point of points) {
        map[point.positionY - yOffset][point.positionX - xOffset] = '#';
    }

    for (let line of map) {
        console.log(line.map(cell => cell ? cell : '.').join(''));
    }
}

function getGraphAxis(points) {
    let xOffset = points.reduce((xMin, point) => Math.min(xMin, point.positionX), Infinity);
    let yOffset = points.reduce((yMin, point) => Math.min(yMin, point.positionY), Infinity);
    let xMax = points.reduce((xMax, point) => Math.max(xMax, point.positionX), -Infinity);
    let yMax = points.reduce((yMax, point) => Math.max(yMax, point.positionY), -Infinity);

    return { xOffset, yOffset, xMax, yMax }
}

function getSpread(points) {
    const { xOffset, yOffset, xMax, yMax } = getGraphAxis(points);

    return {x: xMax - xOffset, y: yMax - yOffset};
}

let bestPoints = points;
let spreadX = Infinity;
let spreadY = Infinity;

let lastThirty = [];

let seconds = 0;
while (true) {
    lastThirty.push({seconds: seconds, points: points});
    if (lastThirty.length > 30) {
        lastThirty.shift();
    }
    seconds++;
    points = simulateTick(points);
    const spread = getSpread(points);
    if (spread.x < spreadX || spread.y < spreadY) {
        bestPoints = points;
        spreadX = spread.x;
        spreadY = spread.y;
    } else {
        if (lastThirty.length > 20) {
            break;
        }
    }
}

lastThirty.forEach(points => {
    console.log(points.seconds);
    printMap(points.points)
});
printMap(points);