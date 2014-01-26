var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	var k = parseInt(d[0]);
	var text = d[1];

	var kmers = [];
	for (var i = 0; i < text.length - k + 1; i++) {
		kmers.push(text.substr(i, k));
	}

	kmers.sort();

	write('out', kmers.join('\n'));
});