var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var IMT = {};

read('integer-mass-table', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	d.forEach(function (s) {
		IMT[s.split(' ')[0]] = parseInt(s.split(' ')[1], 10);
	});

	console.log(JSON.stringify(IMT));

	read('data', {encoding: 'utf8'}, function (e, d) {
		var peptide = d.replace(/\r/g, '');

		var masses = [0, mass(peptide)];

		var visited = [];

		for (var step = 1; step < peptide.length; step++) {
			for (var i = 0; i < peptide.length; i++) {
				var st = peptide.substr(i, step);

				if (st.length < step) {
					var diff = step - st.length;
					st += peptide.substring(0, diff);
				}

				// if (visited.indexOf(st) !== -1) continue;

				visited.push(st);
				console.log(st);
				masses.push(mass(st))
			}
		}

		function comp (a, b) {
			if (a > b) {
				return 1;
			} else if (a === b) {
				return 0;
			}

			return -1;
		}

		console.log(masses.sort(comp));
		console.log(masses.length);
		write('out', masses.sort(comp).join(' '));
	});
});



function mass(subpeptide) {
	console.log(subpeptide.split(''));

	return subpeptide.split('').reduce(function (a, e) {
		return a + IMT[e];
	}, 0);
}