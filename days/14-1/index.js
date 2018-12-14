let recipes = [3, 7];

let elfOnePosition = 0;
let elfTwoPosition = 1;

let startCapture = false;

let part1Done = false;
let part2Done = false;

let lastTen = [];

const target = 327901;

function checkStartCapture() {
    if (startCapture === true) {
        return !part1Done;
    }
    if (recipes.length > target) {
        startCapture = true;
        return true;
    }
}

function checkIfLastTen() {
    const targetStr = target.toString();
    if (recipes.length >= targetStr.length) {
        let str = recipes.slice(recipes.length - targetStr.length, recipes.length).join('');
        if (targetStr === str) {
            console.log('puzzle 2', recipes.length - targetStr.length);
            part2Done = true;
        }
    }
}

while(!part1Done || !part2Done) {
    const elfOneScore = recipes[elfOnePosition];
    const elfTwoScore = recipes[elfTwoPosition];
    const newScore = (elfOneScore + elfTwoScore).toString();
    const recipeOne = newScore[0]; // carful string
    const recipeTwo = newScore[1];

    if (recipeOne) {
        recipes.push(parseInt(recipeOne, 10));
        checkIfLastTen();
        checkStartCapture();

        if (checkStartCapture()) {
            lastTen.push(parseInt(recipeOne, 10))
        }
    }
    if (recipeTwo) {
        recipes.push(parseInt(recipeTwo, 10));
        checkIfLastTen();

        if (checkStartCapture()) {
            lastTen.push(parseInt(recipeTwo, 10))
        }
    }

    elfOnePosition = elfOnePosition + elfOneScore + 1;
    elfTwoPosition = elfTwoPosition + elfTwoScore + 1;

    while (elfOnePosition > (recipes.length - 1)) {
        elfOnePosition = elfOnePosition - recipes.length;
    }
    while (elfTwoPosition > (recipes.length - 1)) {
        elfTwoPosition = elfTwoPosition - recipes.length;
    }

    if (lastTen.length >= 10 && !part1Done) { // 327901
        part1Done = true;
        console.log('puzzle 1', lastTen.slice(0, 10).join(''));
    }
}