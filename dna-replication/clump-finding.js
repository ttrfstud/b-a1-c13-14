var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var bash = require('child_process').spawn;

var dataout = [];
var kids = [];

read('data', {encoding: 'utf8'}, function (err, data) {
	var genome = data.split('\n')[0];
	var ints = data.split('\n')[1];

	var k = ints.split(' ')[0];
	var L = ints.split(' ')[1];
	var t = ints.split(' ')[2];

	for (var i = 0; i < genome.length - L; i++) {
		var window = genome.substring(i).substring(0, L);

		var kid = bash('node', ['most-frequent-kmers-slave.js', window, k, t]);
		kids.push(kid);
		kid.stdout.on('data', function (data) {
			if (data.toString().trim()) {
				[].push.apply(
					dataout, 
					data.
					toString().
					split(' ').
					map(
						function (el) { 
							return el.substring(0, el.length - 1);
						})
					);
			}
		});
		kid.on('exit', (function (kid) {
			return function () {
				kids[kids.indexOf(kid)].terminated = true;
			}
		})(kid));
	}

	var id = setInterval(function () {
		var allTerminated = true;
		for (var i = 0; i < kids.length; i++) {
			if (!kids[i].terminated) allTerminated = false;
		}

		if (allTerminated) {
			clearInterval(id);
			write('out', dataout.reduce(function (acc, el) { 
					if (acc.indexOf(el) === -1) { 
						acc.push(el);
					} 
					return acc;
				}, []).join(' '));
		}
	}, 10);
});