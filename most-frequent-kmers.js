var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (err, data) {
	var str = data.split('\n')[0];
	var k = parseInt(data.split('\n')[1], 10);
	var kmers = [];
	var freqs = {};

	for (var i = 0; i < str.length - k; i++) {
		var kmer = str.substring(i).substring(0, k);
		if (!(kmers.indexOf(kmer) + 1)) {
			kmers.push(kmer);
			freqs[kmer] = 1;
		} else {
			freqs[kmer]++;
		}
	}

	var max = 0;
	for (key in freqs) if (freqs.hasOwnProperty(key)) {
		if (freqs[key] > max) max = freqs[key];
	}

	kmers = [];
	for(key in freqs) if (freqs.hasOwnProperty(key)) {
		if (freqs[key] === max) {
			kmers.push(key);
		}
	}

	write('out', kmers.join(' '));
});

