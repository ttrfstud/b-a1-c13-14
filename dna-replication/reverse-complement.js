var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (err, data) {
	write(
		'out', 
		data.
		split('').
		reverse().
		join('').
		replace(/A/g, '1').
		replace(/G/g, '2').
		replace(/T/g, 'A').
		replace(/1/g, 'T').
		replace(/C/g, 'G').
		replace(/2/g, 'C'));
});