module.exports = {
    sumFrequencies: function sumFrequencies(frequencies) {
        return frequencies.reduce((acc, freq) => acc + freq, 0);
    },
    findFirstFrequencyReachedTwice(frequencies) {
        const frequenciesLength = frequencies.length;
        const reachedFrequencies = new Set();
        let frequency = 0;
        let index = 0;

        while(!reachedFrequencies.has(frequency)) {
            if (index >= frequenciesLength) {
                index = 0;
            }
            reachedFrequencies.add(frequency);
            frequency += frequencies[index];
            index++;
        }
        // console.log(`Found answer in ${iteration} iterations`);
        return frequency;
    }
};

