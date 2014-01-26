var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var p = require('./log');

var map = {'A': 0, 'C': 1, 'G': 2, 'T': 3};

read('data', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	var text = d[0];
	var k = parseInt(d[1]);
	var profileMatrix = d.slice(2).map(function (str) { 
		return str.split(' ').map(function (e) { 
			return parseFloat(e);
		}); 
	});

	p('pm', profileMatrix);

	var maxProb = 0;
	var champion = '';

	for (var i = 0; i < text.length; i++) {
		var kmer = text.substr(i, k);

		if (kmer.length === k) {
			p('kmer', kmer);
			var prob = 1;

			for (var j = 0; j < k; j++) {
				prob *= profileMatrix[j][map[kmer[j]]]; 
			}

			if (prob > maxProb) {
				champion = kmer;
				maxProb = prob;
			}
		}
	}

	write('out', champion);

});