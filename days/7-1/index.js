const fs = require("fs");

const text = fs.readFileSync('./data.txt', { encoding: 'utf-8' });

const alphabet = new Array(26).fill(0).map((zero, index) =>
  String.fromCharCode(index + 'A'.charCodeAt(0)));

// const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function makeAlphabetToArrayObject() {
  return alphabet.reduce((acc, letter) => {
    acc[letter] = [];
    return acc;
  }, {})
}

function textToMaps(text) {
  const regexpr = /^Step (?<from>\w) must be finished before step (?<to>\w) can begin\.$/gm;
  const stepToDependencies = makeAlphabetToArrayObject();
  const stepToDependants = makeAlphabetToArrayObject();
  let match;
  while ((match = regexpr.exec(text)) != null) {
    stepToDependants[match.groups.from].push(match.groups.to);
    stepToDependencies[match.groups.to].push(match.groups.from);
  }
  return { stepToDependants, stepToDependencies};
}

const { stepToDependants, stepToDependencies } = textToMaps(text);

const answer = [];

function getNextStep() {
  const nonBlockedSteps = Object
    .entries(stepToDependencies)
    .filter(([, dependencies]) => dependencies.length === 0)
    .sort(([letterA], [letterB]) => (letterA < letterB) ? -1 : (letterA > letterB) ? 1 : 0);

  return nonBlockedSteps[0]
}

let nextStep;
while ((nextStep = getNextStep()) != null) {
  const letter = nextStep[0];
  answer.push(letter);
  for (let dependantLetter of stepToDependants[letter]) {
    let dependencyArray = stepToDependencies[dependantLetter];
    dependencyArray.splice(dependencyArray.indexOf(dependantLetter));
  }
  delete stepToDependencies[letter];
}

console.log(answer.join(''));



