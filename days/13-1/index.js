'use strict';
const fs = require('fs');

const lines = fs.readFileSync('./data.txt', { encoding: 'utf-8' }).split('\n');

const CART_DIRECTION = { /* tuple of (y, x) form */
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
};

const TURNS = {
  COUNTER_CLOCKWISE: -1,
  STRAIGHT: 0,
  CLOCKWISE: 1,
};


function nextTurn(turn) {
  switch (turn) {
    case TURNS.COUNTER_CLOCKWISE:
      return TURNS.STRAIGHT;
    case TURNS.STRAIGHT:
      return TURNS.CLOCKWISE;
    case TURNS.CLOCKWISE:
      return TURNS.COUNTER_CLOCKWISE;
  }
}

function turnRight(direction) {
  switch (direction) {
    case CART_DIRECTION.UP:
      return CART_DIRECTION.RIGHT;
    case CART_DIRECTION.RIGHT:
      return CART_DIRECTION.DOWN;
    case CART_DIRECTION.DOWN:
      return CART_DIRECTION.LEFT;
    case CART_DIRECTION.LEFT:
      return CART_DIRECTION.UP;
    default:
      throw new Error(`Invalid direction supplied of ${direction}`)
  }
}

function turnLeft(direction) {
  switch (direction) {
    case CART_DIRECTION.UP:
      return CART_DIRECTION.LEFT;
    case CART_DIRECTION.RIGHT:
      return CART_DIRECTION.UP;
    case CART_DIRECTION.DOWN:
      return CART_DIRECTION.RIGHT;
    case CART_DIRECTION.LEFT:
      return CART_DIRECTION.DOWN;
    default:
      throw new Error(`Invalid direction supplied of ${direction}`)
  }
}

function turnN(direction, n) {
  if (n === 0) {
    return direction;
  }
  if (n < 0) {
    return turnN(turnLeft(direction), n + 1);
  }
  if (n > 0) {
    return turnN(turnRight(direction), n - 1);
  }
}

function cartSymbolToDirection(symbol) {
  switch (symbol) {
    case '^':
      return CART_DIRECTION.UP;
    case '>':
      return CART_DIRECTION.RIGHT;
    case 'v':
      return CART_DIRECTION.DOWN;
    case '<':
      return CART_DIRECTION.LEFT;
    default:
      return null;
  }
}

function directionToCartSymbol(direction) {
  switch (direction) {
    case CART_DIRECTION.UP:
      return '^';
    case CART_DIRECTION.RIGHT:
      return '>';
    case CART_DIRECTION.DOWN:
      return 'v';
    case CART_DIRECTION.LEFT:
      return '<';
    default:
      return null;
  }
}

function symbolToDirections(symbol, lines, y, x) {
  const possibleCartDirection = cartSymbolToDirection(symbol);
  if (possibleCartDirection) {
    return [possibleCartDirection, oppositeDirection(possibleCartDirection)]
  }
  if (symbol === '+') {
    return [CART_DIRECTION.UP, CART_DIRECTION.RIGHT, CART_DIRECTION.DOWN, CART_DIRECTION.LEFT];
  }
  if (symbol === '|') {
    return [CART_DIRECTION.UP, CART_DIRECTION.DOWN];
  }
  if (symbol === '-') {
    return [CART_DIRECTION.RIGHT, CART_DIRECTION.LEFT];
  }
  if (symbol === '\\') {
    let symbol = lines[y - 1] && lines[y - 1] && lines[y - 1][x];

    if (symbol && railOrCartSymbolToRail(symbol) === '|' || symbol === '+') {
      return [CART_DIRECTION.UP, CART_DIRECTION.RIGHT]
    } else {
      return [CART_DIRECTION.DOWN, CART_DIRECTION.LEFT];
    }
  }
  if (symbol === '/') {
    let symbol = lines[y - 1] && lines[y - 1] && lines[y - 1][x];

    if (symbol && railOrCartSymbolToRail(symbol) === '|' || symbol === '+') {
      return [CART_DIRECTION.UP, CART_DIRECTION.LEFT];
    } else {
      return [CART_DIRECTION.DOWN, CART_DIRECTION.RIGHT];
    }
  }
  return [];
}

function mapToCarts(lines) {
  let id = 0;
  return lines.map(line => {
    return line.split('').map(entry => {
      const direction = cartSymbolToDirection(entry);
      if (direction) {
        return {
          nextTurn: TURNS.COUNTER_CLOCKWISE,
          direction: direction,
          id: id++,
        }
      } else {
        return null;
      }
    })
  })
}

let track = ['|', '-', '+', '/', '\\'];

function railOrCartSymbolToRail(symbol) {
  if (track.includes(symbol)) {
    return symbol;
  } else if (symbol === '>' || symbol === '<') {
    return '-';
  } else if (symbol === '^' || symbol === 'v') {
    return '|';
  } else {
    return symbol;
  }
}

function mapToRails(lines) {
  return lines.map((line, y) => {
    return line.split('').map((entry, x) => {
      return {
        connections: symbolToDirections(entry, lines, y, x),
        symbol: railOrCartSymbolToRail(entry),
      }
    })
  })
}

const rails = mapToRails(lines);
const carts = mapToCarts(lines);

function logMap(rails, carts) {
  const lines = rails.map(line => {
    return line.map(entry => entry.symbol)
  });
  carts.forEach((line, y) => {
    line.forEach((cart, x) => {
      if (cart) {
        lines[y][x] = directionToCartSymbol(cart.direction);
      }
    });
  });
  lines.forEach(line => console.log(line.join('')));
}

function cloneCarts(carts) {
  return carts.map(line => line.map(cart => cart ? cloneCart(cart) : null))
}

function cloneCart(cart) {
  return Object.assign({}, cart)
}

function newCartHolder(carts) {
  return carts.map(line => line.map(() => null))
}

function oppositeDirection(direction) {
  switch (direction) {
    case CART_DIRECTION.RIGHT:
      return CART_DIRECTION.LEFT;
    case CART_DIRECTION.LEFT:
      return CART_DIRECTION.RIGHT;
    case CART_DIRECTION.DOWN:
      return CART_DIRECTION.UP;
    case CART_DIRECTION.UP:
      return CART_DIRECTION.DOWN;
  }
}

/**
 * Only works with the 4 cardinal directions, no diagonals, two zero vectors are considered not opposite.
 * @param direction1
 * @param direction2
 * @returns {boolean}
 */
function isOppositeDirection(direction1, direction2) {
  const xOpposite = Math.abs(direction1[1] - direction2[1]) === 2;
  const yOpposite = Math.abs(direction1[0] - direction2[0]) === 2;
  return xOpposite || yOpposite;
}

function directionsWithoutDirection(directions, direction) {
  const directionIndex = directions.indexOf(direction);
  if (directionIndex < 0) {
    throw new Error('Direction is not part of directions');
  }
  const directionsClone = directions.slice(0);
  directionsClone.splice(directionIndex, 1);
  return directionsClone
}

function logCross(lines, y, x, cart) {
  if (cart) {
    console.log(new Array(10).fill(directionToCartSymbol(cart.direction)).join('') + cart.nextTurn);

  } else {
    console.log('----------------')
  }
  for (let i = -2; i <= 2; i++) {
    let line = '';
    for (let j = -2; j <= 2; j++) {
      if (!rails[y + i] || !rails[y + i][x + j]) {
        line += 'N';
      } else {
        line += rails[y + i][x + j].symbol
      }
    }
    console.log(line);
  }
  console.log('-------------------');
}

function doubleCheckMove(rails, newCart, y, x, newY, newX) {
  const newRail = rails[newY][newX];
  const oldRail = rails[y][x];
  if (!newRail.connections.some(connection => newY + connection[0] === y && newX + connection[1] === x)) {
    throw new Error('New rail does not connect with old rail');
  }
  if (!oldRail.connections.some(connection => x + connection[1] === newX && y + connection[0] === newY)) {
    throw new Error('New old rail does not connect with new rail');
  }
}

function makeMove(workingCarts, y, x, newY, newX, newCart) {
  if (!workingCarts[newY][newX]) {
    workingCarts[newY][newX] = newCart;
    workingCarts[y][x] = null;
    return false;
  } else {
    workingCarts[newY][newX] = null;
    workingCarts[y][x] = null;
    return true
  }
}

function doTick(rails, carts) {
  const workingCarts = cloneCarts(carts);

  let crashLocations = [];

  carts.forEach((line, y) => {
    line.forEach((cart, x) => {
      if (!workingCarts[y][x]) {
        return;
      }
      if (cart) {
        const rail = rails[y][x];
        if (rail.connections.length === 4) {
          let newCart = cloneCart(cart);
          newCart.direction = turnN(cart.direction, cart.nextTurn);
          newCart.nextTurn = nextTurn(cart.nextTurn);
          const newY = y + newCart.direction[0];
          const newX = x + newCart.direction[1];
          doubleCheckMove(rails, newCart, y, x, newY, newX);
          if (makeMove(workingCarts, y, x, newY, newX, newCart)) {
            crashLocations.push([newX, newY]);
          }
        } else if (rail.connections.length === 2) {
          if (rail.symbol === '-' || rail.symbol === '|') {
            const newCart = cloneCart(cart);
            const newY = y + newCart.direction[0];
            const newX = x + newCart.direction[1];
            doubleCheckMove(rails, newCart, y, x, newY, newX);
            if (makeMove(workingCarts, y, x, newY, newX, newCart)) {
              crashLocations.push([newX, newY]);
            }
          } else {
            const newCart = cloneCart(cart);
            newCart.direction = directionsWithoutDirection(rail.connections, oppositeDirection(cart.direction))[0];
            const newY = y + newCart.direction[0];
            const newX = x + newCart.direction[1];
            doubleCheckMove(rails, newCart, y, x, newY, newX);
            if (makeMove(workingCarts, y, x, newY, newX, newCart)) {
              crashLocations.push([newX, newY]);
            }
          }
        } else {
          console.log(cart, y, x);
          console.log(rail);
          throw new Error('cart left the track');
        }
      }
    });
  });

  return { workingCarts, crashLocations };
}

function countCarts(carts) {
  return carts.reduce((acc, line) => acc + line.reduce((acc, cart) => acc + (cart ? 1 : 0), 0), 0);
}

function findCartLocations(carts) {
  return carts.reduce((acc, line, y) => line.reduce((acc, cart, x) => {
    if (cart) {
      acc.push([x, y]);
    }
    return acc;
  }, acc), []);
}

let newCarts = cloneCarts(carts);
let initialCount = countCarts(newCarts);
let cartCount = initialCount;

while (true) {
  const { workingCarts, crashLocations } = doTick(rails, newCarts);
  newCarts = workingCarts;
  if (cartCount !== countCarts(newCarts)) {
    console.log('cart crash at', crashLocations);
    cartCount = countCarts(newCarts);
  }
  if (cartCount === 1) {
    console.log('last cart remaining at', findCartLocations(newCarts));
    break;
  }
}
