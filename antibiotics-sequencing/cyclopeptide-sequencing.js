var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var imt;
var subpepTable = [];
read('imt2', {encoding: 'utf8'}, function (e, d) {
	imt = intList(d); 

	read('data', {encoding: 'utf8'}, function (e, d) {
		var spectrum = intList(d);

		var stack = [];
		stack.push([]);

		for (var i = 0; i < 20; i++) {
			subpepTable[(i) * (i - 1) + 2] = i;
		}

		var f = filter(imt, spectrum);

		var newStack = [];
		var result = [];

		while(stack.length) {
			console.log('');
			console.log(';;;;;;;;;;;;;;;;;;;;');
			console.log(JSON.stringify(stack));
			console.log('-------------------------------------');
			console.log('');
			for (var i = 0; i < stack.length; i++) {
				for (var j in f) {
					var newEl = stack[i].concat(j | 0);

					if (!consistent(newEl, spectrum)) {
						continue;
					}
					if (cyclospectrumIs(newEl, spectrum)) {
						result.push(newEl);
					} else {
						newStack.push(newEl);
					}
				}	
			}

			// console.log(JSON.stringify(newStack), 'a');
			
			stack = newStack;
			newStack = [];
		}

		// console.log('r', JSON.stringify(result));
		function out(el) { return el.join('-'); }
		write('out', result.map(out).join(' ')); 
	});	
});

function cyclospectrumIs(testee, sp) {
	if (!testee.length) return false;

	var count = 0;

	for (var i in sp) {
		count += sp[i];
	}

	if (subpepTable[count] !== testee.length) return false;

	return true;
}

function consistent(testee, sp) {
	if (!testee.length) return true;

	sp = sp.slice(0);

	var lastSubpeptides = testee.slice(0, testee.length - 1).concat(lsp(testee));

	// console.log('pep', JSON.stringify(testee));
	// console.log('lsps', JSON.stringify(lastSubpeptides));
	for (var i = 0; i < lastSubpeptides.length; i++) {
		if (sp[lastSubpeptides[i]]) {
			sp[lastSubpeptides[i]]--;
		} else {
			return false;
		}
	}

	return true;
}

function lsp(peptide) {
	var last = peptide[peptide.length - 1];

	var lsps = [];

	for (var i = 0; i < peptide.length; i++) {
		
		var sum = last;
		
		for (var j = peptide.length - 2; j >= i; j--) {
			sum += peptide[j];
		}

		lsps.push(sum);
	}

	return lsps;
}

function intList(d) {
	var list = [];

	d.replace(/[\r\n]/g, '').split(' ').forEach(function (e) {
		var n = parseInt(e, 10);

		if (!list[n]) {
			list[n] = 0;
		}

		list[n]++;
	});

	return list;
}

function filter(imt, spectrum) {
	var filtered = [];

	for (var i in imt) {
		if (spectrum[i]) filtered[i] = 1;
	}

	return filtered;
}