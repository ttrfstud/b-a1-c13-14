var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var p = require('./log');

read('data', {encoding: 'utf8'}, function (e, d) {

	var matrix = d.replace(/\r/g, '').split('\n');

	matrix = matrix.map(function (row) { return row.toUpperCase().split(' ');});

	p('matrix', matrix);

	var scoringMatrix = [];

	for (var i = 0; i < matrix[0].length; i++) {
		var as = 0, ts = 0, gs = 0, cs = 0;

		for (var j = 0; j < matrix.length; j++) {
			switch (matrix[j][i]) {
				case 'A': as++; break;
				case 'C': cs++; break;
				case 'G': gs++; break;
				case 'T': ts++; break;
				default: throw new Error();
			}
		}

		scoringMatrix.push([
			as / matrix.length, 
			ts / matrix.length, 
			gs / matrix.length, 
			cs / matrix.length]);
	}

	var columnEntropies = [];

	for (var i = 0; i < scoringMatrix.length; i++) {
		columnEntropies.push(
			-scoringMatrix[i].reduce(function (acc, el) { 
				console.log(acc, el);
				return acc + el * (el && Math.log(el) || 0) / Math.log(2);
			}, 0));
		console.log('000---------');
	}

	function sum (a, b) { return a + b; }

	write('out', columnEntropies.reduce(sum));
});