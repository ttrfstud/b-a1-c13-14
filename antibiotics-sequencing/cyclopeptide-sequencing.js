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
			console.log('`````````````````````````');
			console.log(JSON.stringify(spectrum), 'spectrum');
			expand(stack);
			if (stack.length <= 180) console.log(JSON.stringify(stack), 'bifo');

			// console.log(JSON.stringify(stack));

			for (var i = 0; i < stack.length; i++) {
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
			if (stack.length <= 180) console.log(JSON.stringify(stack), 'afta');
			console.log('==============================');
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

/* Never modify a spectrum under consideration ! */
function cyclospectrumIs(testee, sp) {
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
	console.log('TRU');

	return true;
}

function toSpectrum(subpeptides) {

	var noDuplicates = [];

	// console.log('))))))))))))))))))))))))))))))))))))))toSpectrum');
	console.log(JSON.stringify(subpeptides));

	for (var i = 0; i < subpeptides.length; i++) {
		if (!contains(noDuplicates, subpeptides[i])) {
			noDuplicates.push(subpeptides[i]);
		}
	}

	// console.log('noDuplicates', JSON.stringify(noDuplicates));

	var spectrum = [];

	for (var i = 0; i < noDuplicates.length; i++) {
		spectrum.push(mass(noDuplicates[i]));	
	}

	spectrum.sort(comp);

	// console.log(JSON.stringify(spectrum));
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
	// console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;toSubpeptides');
	// console.log(JSON.stringify(peptide));
	var subpeptides = [[mass(peptide)]];

	peptide = peptide.slice(1); // deleting 0, temporarily;

	for (var i = 1; i < peptide.length; i++) {
		for (var j = 0; j < peptide.length; j++) {
			var subpeptide = peptide.slice(j, j + i);

			// console.log(subpeptide);

			if (subpeptide.length !== i) {
				var diff = i - subpeptide.length;
				subpeptide = subpeptide.concat(peptide.slice(0, diff));
			}

			subpeptides.push(subpeptide);
		}
	}

	subpeptides.push([0]);

	// console.log(JSON.stringify(subpeptides));
	// console.log('::::::::::::::::::::::::::::');
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

function expand(stack) {
	var newStack = [];

	for (var i = 0; i < stack.length; i++) {
		var el = stack[i];

		for (var j = 0; j < imt.length; j++) {
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