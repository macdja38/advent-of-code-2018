module.exports = function fastestFirstDupe(frequencies) {
    const frequenciesLength = frequencies.length;
    const reachedFrequencies = [];
    let frequency = 0;

    outsideLoop: while(true) {
        for(let i = 0; i < frequenciesLength; i++) {
            reachedFrequencies[frequency] = true;
            frequency += frequencies[i];
            if (reachedFrequencies[frequency]) {
                break outsideLoop;
            }
        }
    }
    // console.log(`Found answer in ${iteration} iterations`);
    return frequency;
};