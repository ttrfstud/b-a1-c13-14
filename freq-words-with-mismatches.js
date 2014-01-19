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

	enumerate(k, mRate);

	var i, j, k;

	var perm, mismatch;

	var actualCount = [];

	for (i = 0; i < genome.length - k + 1; i++) {
		var actualNum = toNum(genome.substring(i, i + k));
		if (!actualCount[actualNum]) {
			actualCount[actualNum] = 0;
		}

		actualCount[actualNum]++;
	}

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

function enumerate(k, d) {
	function enumInternal(str, k) {
		if (!k) {
			// console.log('permutation', str);
			var perm = toNum(str);
			permutation[perm] = 1;
			makeMismatches(perm, str, d, []);

			// console.log('mismatches ', Object.keys(mismatches[perm]));
		} else {
			for (var i = 0 ; i < letters.length; i++) {
				enumInternal(str + letters[i], k - 1);
			}
		}
	}

	enumInternal('', k);
}

function makeMismatches(orig, str, d, alreadyAt) {
	function add() {
		// console.log(' mismatch for it ', str);

		var num = toNum(str);
		if (!mismatches[orig]) {
			mismatches[orig] = [];
		}
		mismatches[orig][num] = 1;
	}

	if (!d) {
		add();
	} else {
		// Add all current mismatches
		add();

		// 'Mutate' more
		for (var i = 0; i < str.length; i++) {
			if (!alreadyAt[i]) {
				alreadyAt[i] = 1;
				// console.log('b4 replace', str);
				replace(orig, str, i, d - 1, alreadyAt);
			}
		}
	}
}

function replace(orig, str, i, count, alreadyAt) {
	var copy = str; 
	var ss = String.prototype.substring;
	var len = copy.length;

	for (var j = 0; j < letters.length; j++) {
		str = copy.substring(0, i) + letters[j] + copy.substring(i + 1, len);
		makeMismatches(orig, str, count, alreadyAt);
	}
}

function toNum(str) {
	return parseInt(str.replace(/A/g, '0').replace(/T/g, '1').replace(/C/g, '2').replace(/G/g, '3'));
}

function deNum(num, k) {
	var str = String(num).replace(/0/g, 'A').replace(/1/g, 'T').replace(/2/g, 'C').replace(/3/g, 'G');
	// console.log(str.length, ' - len')
	while (str.length < k)
		str = 'A' + str;
	// console.log(str);

	return str;
}