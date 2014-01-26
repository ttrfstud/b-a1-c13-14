var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	var kmers = d;

	var lst = {};
	for (var i = 0; i < kmers.length; i++) {
		if (!lst[kmers[i]]) {
			lst[kmers[i]] = [];
		}

		for (var j = 0; j < kmers.length; j++) {
			if (overlap(kmers[i], kmers[j])) {
				lst[kmers[i]].push(kmers[j]);
			}
		}
	}

	var presentation = [];
	for (var i in lst) if (lst.hasOwnProperty(i)) {
		var ar = lst[i];

		for (var j = 0; j < ar.length; j++) {
			presentation.push(i + ' -> ' + ar[j]);
		}
	}

	write('out', presentation.join('\n'));
});

function overlap(k1, k2) {
	var len = k1.length;

	var overlapLen = len - 1;

	var k1s = k1.substr(1);
	var k2s = k2.substr(0, overlapLen);

	return k1s === k2s;
}