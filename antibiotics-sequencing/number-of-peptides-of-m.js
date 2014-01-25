var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var imt;
var subpepTable = [];
read('imt2', {encoding: 'utf8'}, function (e, d) {
	imt = intList(d); 

	read('data', {encoding: 'utf8'}, function (e, d) {
		var m = parseInt(d, 10);

		var stack = [];
		stack.push([]);

		var newStack = [];
		var result = 0;

		while(stack.length) {
			for (var i = 0; i < stack.length; i++) {
				for (var j in imt) {
					var newEl = stack[i].concat(j | 0);
					var mass = mass0(newEl);
					if (mass > m) {
						continue;
					}
					if (mass === m) {
						result++;
					} else {
						newStack.push(newEl);
					}
				}	
			}
			stack = newStack;
			newStack = [];
		}

		write('out', result); 
	});	
});

function mass0(a) {
	return a.reduce(function (a, e) { return a + e; });
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