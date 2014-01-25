var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var imt;

read('imt2', {encoding: 'utf8'}, function (e, d) {
	imt = intList(d); 

	read('data', {encoding: 'utf8'}, function (e, d) {
		var spectrum = intList(d);

		var stack = [];
		stack.push([0]);

		var f = filter(imt, spectrum);

		var newStack = [];
		var result = [];

		while(stack.length) {
			stack = expand(stack, f);

			console.log(stack.length);
			for (var i = 0; i < stack.length; i++) {
				if (cyclospectrumIs(stack[i], spectrum)) {
					result.push(stack[i]);
				} else if (consistent(stack[i], spectrum)) {
					newStack.push(stack[i]);
				}
			}

			stack = newStack;
			newStack = [];
		}

		function out(el) { return el.join('-'); }
		write('out', result.map(out).join(' ')); 
	});	
});

function cyclospectrumIs(testee, sp) {
	sp = sp.slice(0);

	var totalSubpeptides = (testee.length - 1) * 
	(testee.length - 2) + 1 - testee.length + 1;

	for (var i = 0; i < testee.length; i++) {
		if (sp[testee[i]]) {
			sp[testee[i]]--;
		} else {
			return false;
		}
	}

	var count = 0;
	for (var i in sp) {
		count += sp[i];
	}

	if (count !== totalSubpeptides) return false;

	return true;
}

function consistent(testee, sp) {
	sp = sp.slice(0);

	for (var i = 0; i < testee.length; i++) {
		if (sp[testee[i]]) {
			sp[testee[i]]--;
		} else {
			return false;
		}
	}

	return true;
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

function expand(stack, filter) {
	var newStack = [];

	for (var i = 0; i < stack.length; i++) {
		var el = stack[i];

		for (var j in filter) {
			newStack.push(el.concat(j));
		}	
	}

	return newStack;
}

function filter(imt, spectrum) {
	var filtered = [];

	for (var i in imt) {
		if (spectrum[i]) filtered[i] = 1;
	}

	return filtered;
}