module.exports.km = function (str, k, t) {

	var power = Math.pow(10, k - 1)|0;
	var freqs = [];
	var kmer;
	var first; 
	var kmers = [];

	first = kmer = parseInt(str.substring(0, k))|0;
	freqs[kmer] = 1;

	for (var i = k; i < str.length; i++) {
		kmer = (trim(kmer, power) * 10) + (parseInt(str[i]));

		if (!freqs[kmer]) {
			freqs[kmer] = 1;
		} else {
			freqs[kmer]++;
			if (freqs[kmer] >= t) {
				kmers[kmer] = 1;
			}

		}
	}

	module.exports.trim = trim;
	module.exports.power = power;
	return {first: first, last: kmer, freqs: freqs, clumping: kmers};
}

function trim(num, power) {
	return (num|0) % (power|0);
}