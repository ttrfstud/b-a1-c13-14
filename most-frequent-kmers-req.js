module.exports.km = function (str, k, t) {

	var power = Math.pow(10, k - 1)|0;
	var freqs = [];
	var kmer;
	var first; 
	var kmers = [];
	var sumext = 0;
	first = kmer = parseInt(str.substring(0, k))|0;
	freqs[kmer] = 1;

	console.log(str.length, str, k - 1);
	console.log(kmer);
	for (var i = k; i < str.length; i++) {
		console.log(str.length, str, i);
		kmer = (trim(kmer, power) * 10) + (parseInt(str[i]));
		console.log(kmer);
		if (!freqs[kmer]) {
			console.log('Adding ' + kmer);
			freqs[kmer] = 1;
			console.log('fr ' + Object.keys(freqs).toString());
		} else {
			console.log('fr ' + Object.keys(freqs).toString());
			console.log('Increasing ' + kmer + '(Was ' + freqs[kmer] + ')');
			freqs[kmer]++;
			if (freqs[kmer] >= t) {
				kmers[kmer] = 1;
			}

		}

			sumext+= 1;
	}

	var sum = 0;
	for (key in freqs) {
		sum += freqs[key];
		console.log(freqs[key]);		
	}

	console.log('sum ', sum, sumext);

	module.exports.trim = trim;
	module.exports.power = power;
	return {first: first, last: kmer, freqs: freqs, clumping: kmers};
}

function trim(num, power) {
	return (num|0) % (power|0);
}