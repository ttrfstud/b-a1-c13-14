var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	var k = parseInt(d[0].split(' ')[0]);

	var dna = d[1];

	d = parseInt(d[0].split(' ')[1]);

	console.log('dna', dna);

	var pairs = [];

	for (var i = 0; i < dna.length - 2 * k - d + 1; i++) {
		var k1 = dna.substr(i, k);
		var k2 = dna.substr(i + k + d, k);

		pairs.push('(' + k1 + '|' + k2 + ')');
	}

	pairs.sort();
	
	console.log('pairs', pairs);

	write('out', pairs.join(' '));
});