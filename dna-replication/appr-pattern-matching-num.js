var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var km = require('./most-frequent-kmers-req');

read('data', {encoding: 'utf8'}, function (err, data) {

	var pattern = data.split('\n')[0].replace('\r', '');
	var genome = data.split('\n')[1].replace('\r', '');

	var mismatchRate = parseInt(data.split('\n')[2]);

	var occurrences = [];

	for (var i = 0; i < genome.length - pattern.length + 1; i++) {
		if(distance(genome.substring(i, i + pattern.length), pattern) <= mismatchRate) {
			occurrences.push(i);
		}
	}

	write('out', occurrences.length);
});

function distance(actual, expected) {
	var distance = 0;

	for (var i = 0; i < actual.length; i++) {
		if (actual[i] !== expected[i]) {
			distance++;
		}
	}

	return distance;
}