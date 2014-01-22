var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var imt;

read('imt2', {encoding: 'utf8'}, function (e, d) {
	imt = d.split(' ').map(function (el) {
		return parseInt(el, 10);
	});

	// console.log('imt', imt);

	read('data', {encoding: 'utf8'}, function (e, d) {
		var m0 = parseInt(d, 10);

		var table = {};
		
		for (var m = 0; m < m0; m += 20) {
			var stackframes = [];

			stackframes.push([[0]]);

			var result = 0;

			while(stackframes[stackframes.length - 1].length) {
				var prev = stackframes[stackframes.length - 1];
				var frame = [];
				stackframes.push(frame);

				// console.log('prev', JSON.stringify(prev), '\n\n\n\n');

				for (var i = 0; i < prev.length; i++) {
					if (mass(prev[i]) < m) {
						selectivePush(frame, extend(prev[i]), m);
					}

					if (mass(prev[i]) === m) {
						result++;
					}
				}
			}

			table[m] = result;
		}

		write('out', JSON.stringify(table));

	});
});

function selectivePush(a, els, m) {
	for (var i = 0; i < els.length; i++) {
		var el = els[i];

		var present = false;
		for (var j = 0; j < a.length; j++) {
			if (same(a[j], el)) present = true;
		}

		if (!present && mass(el) <= m) {
			// console.log(mass(el));
			a.push(el);
		}
	}
}

function same(a1, a2) {
	if (a1.length !== a2.length) {
		return false;
	}

	function comp (a, b) {
		return a > b && 1 || a < b && -1 || 0;
	}

	a1.sort(comp);
	a2.sort(comp);

	for (var i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) return false;
	}

	return true;
};

function extend (mass) {
	var ext = [];

	for (var i = 0; i < imt.length; i++) {
		var copy = mass.slice(0);
		copy.push(imt[i]);
		ext.push(copy);
	}

	return ext;
}

function mass(peptide) {
	var m = 0;

	// console.log('computing mass of', JSON.stringify(peptide));

	for (var i = 0; i < peptide.length; i++) m += peptide[i];

	// console.log('mass is', m);

	return m;
}