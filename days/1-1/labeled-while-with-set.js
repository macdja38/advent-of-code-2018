module.exports = function fastestFirstDupe(frequencies) {
    const frequenciesLength = frequencies.length;
    const reachedFrequencies = new Set();
    let frequency = 0;

    outsideLoop: while(true) {
        for(let i = 0; i < frequenciesLength; i++) {
            reachedFrequencies.add(frequency);
            frequency += frequencies[i];
            if (reachedFrequencies.has(frequency)) {
                break outsideLoop;
            }
        }
    }
    // console.log(`Found answer in ${iteration} iterations`);
    return frequency;
};