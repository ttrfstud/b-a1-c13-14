var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data2', {encoding: 'utf8'}, function (e, d) {
	var spectrum = list(d);
	var convolution = [];

	function sort(a, b) {
		return a > b && 1 || a < b && -1 || 0;
	}

	spectrum.sort(sort);

	for (var i = 0; i < spectrum.length; i++) {
		for (var j = 0; j < i; j++) {
			if (spectrum[i] - spectrum[j])
				convolution.push(spectrum[i] - spectrum[j]);
		}
	}

	write('out', convolution.join(' '));
});

function list(d) {
	return d.replace(/\r\n/g, '').split(' ').map(function (e) {
		return parseInt(e);
	});
}