const fs = require('fs');

const lines = fs.readFileSync('./data.txt', {encoding: 'utf-8'})
    .split('\n')
    .filter(number => number !== '')
    .sort();

let guards = {};


let guard = {};
let startTime = 0n;
for (let line of lines) {
    if (/^\[(.*)] Guard #(\d+) begins shift$/.test(line)) {
        const [, date, id] = line.match(/^\[(.*)] Guard #(\d+) begins shift$/);
        guard = guards[id] || {id: id, times: [], totalTime: 0};
        guards[id] = guard;
    } else if (/^\[(.*)] falls asleep$/.test(line)) {
        const [, date] = line.match(/^\[(.*)] falls asleep$/);
        let parsedDate = Date.parse(date);
        startTime = parsedDate
    } else if (/^\[(.*)] wakes up$/.test(line)) {
        const [, date] = line.match(/^\[(.*)] wakes up$/);
        let parsedDate = Date.parse(date);
        let timeDifference = parsedDate - startTime;
        guard.times.push({start: startTime, end: parsedDate});
        guard.totalTime += timeDifference;
    } else {
        throw new Error("invalid string" + line);
    }
}

let foundGuard = {totalTime: 0};

for (guard of Object.values(guards)) {
    if (guard.totalTime > foundGuard.totalTime) {
        foundGuard = guard;
    }
}

let minutes = new Array(60 * 24).fill(0).map((value, minute) => {
    return minute;
});

let result = minutes.map(minute => {
    return {
        minute,
        daysAsleepAtMinute: (foundGuard.times.reduce(((acc, {start, end}) => {
            let startDate = new Date(start);
            let startMinute = startDate.getMinutes() + (60 * startDate.getHours());
            let endDate = new Date(end);
            let endMinute = endDate.getMinutes() + (60 * endDate.getHours());

            if (startDate.getDay() !== endDate.getDay()) {
                if (startMinute >= minute && minute < endMinute) {
                    return acc + 1;
                }
            } else {
                if (startMinute <= minute && minute < endMinute) {
                    return acc + 1;
                }
            }
            return acc;
        }), 0))
    };
});

let bestMinute = {daysAsleepAtMinute: 0};

for (let minute of Object.values(result)) {
    if (minute.daysAsleepAtMinute > bestMinute.daysAsleepAtMinute) {
        bestMinute = minute;
    }
}

console.log(`part 1: guard id ${foundGuard.id}, best minute ${bestMinute.minute}. Answer ${parseInt(foundGuard.id, 10) * bestMinute.minute}`);

let part2 = Object.values(guards).reduce((bestGuardInMeta, guard) => {
    let result = minutes.map(minute => {
        return {
            minute,
            daysAsleepAtMinute: (guard.times.reduce(((acc, {start, end}) => {
                let startDate = new Date(start);
                let startMinute = startDate.getMinutes() + (60 * startDate.getHours());
                let endDate = new Date(end);
                let endMinute = endDate.getMinutes() + (60 * endDate.getHours());

                if (startDate.getDay() !== endDate.getDay()) {
                    if (startMinute >= minute && minute < endMinute) {
                        return acc + 1;
                    }
                } else {
                    if (startMinute <= minute && minute < endMinute) {
                        return acc + 1;
                    }
                }
                return acc;
            }), 0))
        };
    });

    let bestMinute = {daysAsleepAtMinute: 0};

    for (let minute of Object.values(result)) {
        if (minute.daysAsleepAtMinute > bestMinute.daysAsleepAtMinute) {
            bestMinute = minute;
        }
    }

    if (bestMinute.daysAsleepAtMinute > bestGuardInMeta.daysAsleepAtSameMinute) {
        return { daysAsleepAtSameMinute: bestMinute.daysAsleepAtMinute, guard, minute: bestMinute };
    }
    return bestGuardInMeta

}, { daysAsleepAtSameMinute: 0 });

console.log(`part 2: guard id ${part2.guard.id}, best minute ${part2.minute.minute}. Answer ${parseInt(part2.guard.id, 10) * part2.minute.minute}`);
