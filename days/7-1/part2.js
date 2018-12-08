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
  return { stepToDependants, stepToDependencies };
}

const { stepToDependants, stepToDependencies } = textToMaps(text);

let started = new Set();

function getNextStep() {
  const nonBlockedSteps = Object
    .entries(stepToDependencies)
    .filter(([, dependencies]) => dependencies.length === 0)
    .filter(([letter]) => !started.has(letter))
    .sort(([letterA], [letterB]) => (letterA < letterB) ? -1 : (letterA > letterB) ? 1 : 0);

  return nonBlockedSteps[0]
}

let workersFree = 5;

let queue = [];

let time = 0;


while (true) {
  if (Array.isArray(queue[time]) && queue[time].length > 0) {
    for (let taskLetter of queue[time]) {
      for (let dependantLetter of stepToDependants[taskLetter]) {
        let dependencyArray = stepToDependencies[dependantLetter];
        dependencyArray.splice(dependencyArray.indexOf(dependantLetter));
      }
      delete stepToDependencies[taskLetter];
      workersFree += 1;
    }
    queue[time] = [];
  }
  if (workersFree > 0) {
    const nextStep = getNextStep();
    if (nextStep) {
      const letter = nextStep[0];
      const completionTime = letter.charCodeAt(0) - "A".charCodeAt(0) + 61;
      const queueEntry = queue[completionTime + time] || [];
      started.add(letter);
      queueEntry.push(letter);
      queue[completionTime + time] = queueEntry;
      workersFree -= 1;
      continue;
    }
  }
  if (Object.keys(stepToDependencies).length === 0) {
    console.log(time);
    break;
  }
  time++;
}


