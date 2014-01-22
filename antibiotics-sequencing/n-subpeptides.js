var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e, d) {
	var n = parseInt(d, 10);

	var nSubpeptides = 0;

	for (var i = 2; i <= n; i++) {
		nSubpeptides += i;
	} 

	for (var i = n - 2; i >= 0; i--) {
		nSubpeptides += i;
	}

	write('out', nSubpeptides);
});