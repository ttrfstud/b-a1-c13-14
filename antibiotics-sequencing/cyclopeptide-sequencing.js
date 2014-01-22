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

		console.log(stack);

		while(stack.length) {
			expand(stack);

			for (var i in stack) {
				console.log(JSON.stringify(stack));

				if (cyclospectrumIs(stack[i], spectrum)) {
					result.push(stack[i]);
					stack = stack.splice(i, 1);
				}

				if (!consistent(stack[i], spectrum)) {
					stack = stack.splice(i, 1);
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

/* Never modify a spectrum under consideration ! */
function cyclospectrumIs(testee, sp) {
	testee = testee.slice(0);

	testee.sort(comp);

	if (sp.length !== testee.length) {
		return false;
	}

	for (var i = 0; i < sp.length; i++) {
		if (sp[i] !== testee[i]) return false;
	}

	return true;
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

	[].splice.apply(stack, [0, stack.length].concat(newStack));
}