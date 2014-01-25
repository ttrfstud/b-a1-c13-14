var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var imt;

read('imt2', {encoding: 'utf8'}, function (e, d) {
	imt = intList(d); 

	read('data', {encoding: 'utf8'}, function (e, d) {
		var spectrum = intList(d);

		spectrum.sort(comp);

		var stack = [];
		stack.push([0]);


		var result = [];

		while(stack.length) {
			expand(stack, spectrum);

			console.log(stack.length);
			for (var i = 0; i < stack.length; i++) {
				// if (i % 1000 === 0) console.log(i);
				if (cyclospectrumIs(stack[i], spectrum)) {
					result.push(stack[i]);
					stack.splice(i, 1);
					i--;
					continue;
				}

				if (!consistent(stack[i], spectrum)) {
					stack.splice(i, 1);
					i--;
				}

			}
		}

		function out(el) {
			return el.join('-');
		}

		write('out', result.map(out).join(' ')); 
	});	
});

function comp(a, b) {
	return a > b && 1 || a < b && -1 || 0;
}

function cyclospectrumIs(testee, sp) {
	return false;

	testee = testee.slice(0);
	sp = sp.slice(0);

	var testeeSpectrum = toSpectrum(toSubpeptides(testee));

	if (testeeSpectrum.length !== sp.length) {
		return false;
	}

	for (var i = 0; i < sp.length; i++) {
		var idx = sp.indexOf(testeeSpectrum[i]);

		if (idx === -1) {
			return false;
		} else {
			sp.splice(idx, 1);
		}
	}

	return true;
}

function toSpectrum(subpeptides) {

	var noDuplicates = [];

	for (var i = 0; i < subpeptides.length; i++) {
		if (!contains(noDuplicates, subpeptides[i])) {
			noDuplicates.push(subpeptides[i]);
		}
	}

	var spectrum = [];

	for (var i = 0; i < noDuplicates.length; i++) {
		spectrum.push(mass(noDuplicates[i]));	
	}

	spectrum.sort(comp);

	return spectrum;
}

function contains(subpeptides, subpeptide) {
	for (var i = 0; i < subpeptides.length; i++) {
		if (same(subpeptides[i], subpeptide)) return true;
	}

	return false;
}

function same(a1, a2) {
	a1.sort(comp);
	a2.sort(comp);

	if (a1.length !== a2.length) {
		return false;
	}

	for (var i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) return false;
	}

	return true;
}

function toSubpeptides(peptide) {
	var subpeptides = [[mass(peptide)]];

	peptide = peptide.slice(1); // deleting 0, temporarily;

	for (var i = 1; i < peptide.length; i++) {
		for (var j = 0; j < peptide.length; j++) {
			var subpeptide = peptide.slice(j, j + i);

			if (subpeptide.length !== i) {
				var diff = i - subpeptide.length;
				subpeptide = subpeptide.concat(peptide.slice(0, diff));
			}

			subpeptides.push(subpeptide);
		}
	}

	subpeptides.push([0]);

	return subpeptides;
}

function consistent(testee, sp) {
	testee = testee.slice(0);
	sp = sp.slice(0);

	if (testee.length >= sp.length) {
		throw new Error('cannot be!');
	}

	for (var i = 0; i < testee.length; i++) {
		var idx = sp.indexOf(testee[i]);

		if (idx === -1) {
			return false;
		} else {
			sp.splice(idx, 1);
		}
	}

	return true;
}

function intList(d) {
	return d.replace(/[\r\n]/g, '').split(' ').map(function (e) {
		return parseInt(e, 10);
	});
}

function expand(stack, spectrum) {
	var newStack = [];

	for (var i = 0; i < stack.length; i++) {
		var el = stack[i];

		for (var j = 0; j < imt.length; j++) {
			if (spectrum.indexOf(imt[j]) === -1) continue;

			newStack.push(el.concat(imt[j]));
		}	
	}

	stack.length = 0;

	for  (var i = 0; i < newStack.length; i++) {
		stack.push(newStack[i]);
	}
}

function mass(peptide) {
	var m = 0;

	for (var i = 0; i < peptide.length; i++) {
		m += peptide[i];
	}

	return m;
}