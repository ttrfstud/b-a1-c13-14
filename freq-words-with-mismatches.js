var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var letters = ['A', 'T', 'C', 'G'];

var permutation = [];
var mismatches = [];

var withMismatchesCount = [];

read('data', {encoding: 'utf8'}, function (err, data) {

	data = data.toString().split(' ');

	var genome = data[0];
	var k = parseInt(data[1], 10) | 0;
	var mRate = parseInt(data[2], 10) | 0;


	var i, j, k;

	var perm, mismatch;

	var actualCount = [];
	var actual = [];

	for (i = 0; i < genome.length - k + 1; i++) {
		var currentActual = genome.substring(i, i + k)
		var actualNum = toNum(currentActual);
		if (!actualCount[actualNum]) {
			actualCount[actualNum] = 0;
			actual.push(currentActual);
		}

		actualCount[actualNum]++;
	}

	enumerate(k, mRate, actual);

	var max = -1;
	for (var perm in permutation) {
		withMismatchesCount[perm] = 0;

		for (var mismatch in mismatches[perm]) {
			// console.log('mm', mismatch);
			withMismatchesCount[perm] += actualCount[mismatch] || 0;
		}

		if (withMismatchesCount[perm] > max) {
			max = withMismatchesCount[perm];
		}
	}

	var champions = [];
	for (perm in withMismatchesCount) {
		if (withMismatchesCount[perm] == max) {
			champions.push(perm);
		}
	}

	console.log('champions ', champions.toString());
	console.log('champions ', champions.length);
	champions = champions.map(function (el) {
		return deNum(el, k);
	});

	write('out', champions.join(' '));
});

function enumerate(k, d, actual) {
	function enumInternal(str, k) {
		if (!k) {
			var perm = toNum(str);
			permutation[perm] = 1;

			mismatches[perm] = [];
			for (var i = 0; i < actual.length; i++) {
				if (distance(str, actual[i]) <= d) {
					mismatches[perm][toNum(actual[i])] = 1;
				}
			}
		} else {
			for (var i = 0 ; i < letters.length; i++) {
				enumInternal(str + letters[i], k - 1);
			}
		}
	}

	enumInternal('', k);
}

function distance(str1, str2) {
	var dist = 0;

	for (var i = 0; i < str1.length; i++) {
		if (str1[i] !== str2[i]) dist++;
	}

	return dist;
}

function toNum(str) {
	return parseInt(str.replace(/A/g, '0').replace(/T/g, '1').replace(/C/g, '2').replace(/G/g, '3'));
}

function deNum(num, k) {
	var str = String(num).replace(/0/g, 'A').replace(/1/g, 'T').replace(/2/g, 'C').replace(/3/g, 'G');
	while (str.length < k)
		str = 'A' + str;

	return str;
}