var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var p = require('./log');

read('data', {encoding: 'utf8'}, function (e, d) {

	d = d.replace(/\r/g, '').split('\n');

	var k = parseInt(d[0]);
	var dna = d.slice(1);

	var dnaKmers = [];

	for (var i = 0; i < dna.length; i++) {
		var kmers = [];

		for (var j = 0; j < dna[i].length; j++) {
			var kmer = dna[i].substr(j, k);

			if (kmer.length === k) {
				kmers.push(kmer);
			}
		}

		dnaKmers.push(kmers);
	}

	var permutations = [];

	permutate();

	p('perms', permutations);
	p('dnaKmers', dnaKmers);

	function permutate() {
		function permutateInternal(str, count) {
			if (!count) {
				permutations.push(str);
			} else {
				permutateInternal(str + 'A', count - 1);
				permutateInternal(str + 'T', count - 1);
				permutateInternal(str + 'C', count - 1);
				permutateInternal(str + 'G', count - 1);
			}
		}

		permutateInternal('', k);
	}

	var bestPattern = permutations[0];

	for (var i = 0; i < permutations.length; i++) {


		if (dist(permutations[i], dnaKmers) < dist(bestPattern, dnaKmers)) {
			bestPattern = permutations[i];
		}
	}

	write('out', bestPattern);
});

function dist(kmer, dnaKmers) {
	var localMin = Number.MAX_VALUE, localMins = [];

	for (var i = 0; i < dnaKmers.length; i++) {
		localMin = Number.MAX_VALUE;

		for (var j = 0; j < dnaKmers[i].length; j++) {
			var h = hamming(dnaKmers[i][j], kmer);
			if (h < localMin) localMin = h;
		}

		// console.log('\n===================');
		// p('min dist between', dnaKmers[i]);
		// p('and', kmer);
		// p('is', localMin);
		// console.log('====================');

		localMins.push(localMin);
	}

	// p('all localMins', localMins);

	return localMins.reduce(function (a, b) { return a + b; });
}

function hamming(k1, k2) {
	var count = 0;

	for (var i = 0; i < k1.length; i++) {
		if (k1[i] !== k2[i]) count++;
	}

	return count;
}