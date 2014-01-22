var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('rna-codon-table', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '');
	d = d.split('\n');

	d = d.map(function (s) {
		return s.split(' ');
	});

	var table = {};

	d.forEach(function (pair) {
		if (!table[pair[1]]) {
			table[pair[1]] = [];
		}
		table[pair[1]].push(pair[0]);
	});

	read('data', {encoding: 'utf8'}, function (e, d) {
		var tyrocidine = d.replace(/\r/g, '');

		var ways = 1;
		for (var i = 0; i < tyrocidine.length; i++) {
			ways *= table[tyrocidine.charAt(i)].length;
		}

		write('out', ways);
	});
});