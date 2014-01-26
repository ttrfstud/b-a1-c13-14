var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	var k = parseInt(d[0]);

	var dna = d[1];

	var lst = {};

	var presentation = [];

	var prev;
	for (var i = 0; i < dna.length - k + 2; i++) {
		var node = dna.substr(i, k - 1);

		if (!lst[node]) {
			lst[node] = [];
		}

		// console.log('node?', node);
		if (prev) {
			// console.log('prev?', prev);
			lst[prev].push(node);
		}

		prev = node;
	}

	for (var i in lst) if (lst.hasOwnProperty(i)) {
		if (!lst[i].length) delete(lst[i]);
		else {
			var str = i + ' -> ';
			prefix = '';
			for (var j = lst[i].length - 1; j >= 0; j--) {
				str += prefix + lst[i][j];
				prefix = ',';
			}

			presentation.push(str);
		}
	}



	write('out', '\n' + presentation.join('\n'), {flag: 'a'});
});