var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var letters = ['A', 'T', 'C', 'G'];

var permutation = [];
var mismatches = [];

var withMismatchesCount = [];

var powers = [];

read('data', {encoding: 'utf8'}, function (err, data) {

	data = data.toString().split(' ');

	var genome = data[0];
	var k = parseInt(data[1], 10) | 0;
	var mRate = parseInt(data[2], 10) | 0;

	var i;

	var perm, mismatch;

	var actualCount = [];
	var actual = [];

	i = k;

	var power;
	while ((power = Math.pow(4, (i-- - 1))) >= 1) {
		powers.push(power);
	}

	console.log('powers', powers);

	for (i = 0; i < genome.length - k + 1; i++) {
		var actualNum = toNum(genome.substring(i, i + k)) | 0;
		if (!actualCount[actualNum]) {
			actualCount[actualNum] = 0;
		}

		actualCount[actualNum]++;
	}

	enumerate(k, mRate, actualCount, powers);

	var max = -1;
	for (var perm in permutation) {
		withMismatchesCount[perm] = 0;

		for (var mismatch in mismatches[perm]) {
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

	champions = champions.map(function (el) {
		return deNum(el, k);
	});

	write('out', champions.join(' '));
});

function enumerate(k, d, actual, powers) {
	function enumInternal(str, k) {
		if (!k) {
			var perm = toNum(str);
			permutation[perm] = 1;

			mismatches[perm] = [];
			for (var act in actual) {
				if (distance(perm, act, powers) <= d) {
					mismatches[perm][act] = 1;
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

function distance(num1, num2, powers) {
	num2 = num2 | 0;

	var dist = 0;

	var rem1, rem2;

	for (var i = 0; i < powers.length; i++) {
		rem1 = (num1 / powers[i]) | 0;
		rem2 = (num2 / powers[i]) | 0;
		if (rem1 !== rem2) dist++;
		num1 = (num1 % powers[i]) | 0;
		num2 = (num2 % powers[i]) | 0;
	}

	return dist;
}

function toNum(str) {
	return parseInt(str.replace(/A/g, '0').replace(/T/g, '1').replace(/C/g, '2').replace(/G/g, '3'), 4);
}

function deNum(num, k) {
	var str = Number(num).toString(4).toString(4).replace(/0/g, 'A').replace(/1/g, 'T').replace(/2/g, 'C').replace(/3/g, 'G');
	while (str.length < k)
		str = 'A' + str;

	return str;
}