"use strict";

const players = 410;
const lastMarbleValue = 72059;

function runGame(players, lastMarbleValue) {
    let currentMarble = {
        value: 0,
        next: null,
        prev: null,
    };
    currentMarble.next = currentMarble;
    currentMarble.prev = currentMarble;

    const playerArray = Array.from({length: players}, () => 0);

    for (let i = 1; i <= lastMarbleValue; i++) {
        const player = (i - 1) % players;
        if (i % 23 === 0) {
            let marbleToRemove = currentMarble.prev.prev.prev.prev.prev.prev.prev;
            let next = marbleToRemove.next;
            let prev = marbleToRemove.prev;
            marbleToRemove.prev.next = next;
            marbleToRemove.next.prev = prev;
            currentMarble = marbleToRemove.next;
            playerArray[player] += (marbleToRemove.value + i);
        } else {
            let placedMarble = {
                value: i,
                next: currentMarble.next.next,
                prev: currentMarble.next,
            };
            currentMarble.next.next.prev = placedMarble;
            currentMarble.next.next = placedMarble;
            currentMarble = placedMarble;
        }
    }

    return playerArray.reduce((highest, score, index) => {
        if (score > highest.score) {
            return {index, score};
        }
        return highest;
    }, {index: 0, score: 0});
}

let part1 = runGame(players, lastMarbleValue);
console.log(part1);
let part2 = runGame(players, lastMarbleValue * 100);
console.log(part2);
