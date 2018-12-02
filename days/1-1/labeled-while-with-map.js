module.exports = function fastestFirstDupe(frequencies) {
    const frequenciesLength = frequencies.length;
    const reachedFrequencies = new Map();
    let frequency = 0;

    outsideLoop: while(true) {
        for(let i = 0; i < frequenciesLength; i++) {
            reachedFrequencies.set(frequency, true);
            frequency += frequencies[i];
            if (reachedFrequencies.get(frequency)) {
                break outsideLoop;
            }
        }
    }
    // console.log(`Found answer in ${iteration} iterations`);
    return frequency;
};