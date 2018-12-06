const fs = require("fs");

const text = fs.readFileSync('./data.txt', { encoding: 'utf-8' });

function strToCoords(text) {
  const regexpr = /^(?<x>\d+), (?<y>\d+)$/gm;
  let match;
  let index = 0;
  const coords = [];
  while ((match = regexpr.exec(text)) != null) {
    const x = parseInt(match.groups.x);
    const y = parseInt(match.groups.y);
    coords.push({ x, y, id: index });
    index += 1;
  }
  return coords;
}

function manhattenDistance(x1, y1, x2, y2) {
  const computeDifference = (x2, y2) => {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  };
  if (x2 === undefined && y2 === undefined) {
    return computeDifference;
  }
  return computeDifference(x2, y2);
}

const cords = strToCoords(text);

const xCords = cords.map(chord => chord.x);
const yCords = cords.map(chord => chord.y);
const xMax = Math.max(...xCords);
const yMax = Math.max(...yCords);

function part1() {
  const map = Array.from({ length: xMax }, () => new Uint8Array(yMax));

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const computeDistance = manhattenDistance(rowIndex, colIndex);
      const { closestCord, shared } = cords.reduce(({ distanceToClosestCord, closestCord, shared }, cord) => {
        const distance = computeDistance(cord.x, cord.y);
        if (distance < distanceToClosestCord) {
          return { distanceToClosestCord: distance, closestCord: cord, shared: false };
        }
        if (distance === distanceToClosestCord) {
          return { distanceToClosestCord: distance, shared: true };
        }
        return { distanceToClosestCord, closestCord, shared };
      }, { distanceToClosestCord: Infinity });

      if (shared) {
        return;
      }
      map[rowIndex][colIndex] = closestCord.id;
    });
  });

  return cords.reduce((bestCord, cord) => {
    const claim = map.reduce((acc, row, rowIndex) => {
      return acc + row.reduce((acc, cell, colIndex) => {
        if (cell === cord.id) {
          if (rowIndex === 0 || rowIndex === (xMax - 1) || colIndex === 0 || colIndex === (yMax - 1)) {
            return Infinity
          }
          return acc + 1;
        }
        return acc;
      }, 0);
    }, 0);
    if (claim === Infinity) {
      return bestCord;
    }
    if (claim > bestCord.claim) {
      return { claim, cord };
    }
    return bestCord;
  }, { claim: 0 });
}

function part2() {
  const maxDistance = 10000;
  const map = Array.from({ length: xMax }, () => new Uint8Array(yMax));

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const computeDistance = manhattenDistance(rowIndex, colIndex);
      const totalDistance = cords.reduce((totalDistance, cord) => {
        return computeDistance(cord.x, cord.y) + totalDistance;
      }, 0);

      if (totalDistance < maxDistance) {
        map[rowIndex][colIndex] = 1;
      }
    });
  });

  return map.reduce((acc, row) => {
    return acc + row.reduce((acc, cell) => {
      return acc + cell;
    }, 0);
  }, 0);
}


console.log(part1());
console.log(part2());
// fs.writeFileSync("./map.csv", map.map(row => row.join(", ")).join("\n"));

