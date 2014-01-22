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
		table[pair[0]] = pair[1];
	});

	read('data', {encoding: 'utf8'}, function (e, d) {
		var rna = d.replace(/\r/g, '');
		var amino = '';
		for (var i = 0; i < rna.length; i += 3) {
			amino += table[rna.substr(i, 3)] || '';
		}

		write('out', amino);
	});
});