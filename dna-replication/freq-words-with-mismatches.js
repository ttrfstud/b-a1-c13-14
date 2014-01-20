var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var letters = [];
letters[0] = 1;
letters[1] = 1;
letters[2] = 1;
letters[3] = 1;

var count = [];

var powers = [];

read('data', {encoding: 'utf8'}, function (err, data) {
	var start = new Date().getTime();
	data = data.toString().split(' ');

	var genome = data[0];
	var k = parseInt(data[1], 10) | 0;
	var mRate = parseInt(data[2], 10) | 0;

	var i;

	var perm, mismatch;

	var mutatesCache = [];

	i = k;

	var power;
	while ((power = Math.pow(4, (i-- - 1))) >= 1) {
		powers.push(power);
	}

	// console.log('powers', powers);

	var max = -1;

	for (i = 0; i < genome.length - k + 1; i++) {
		var actual = toNum(genome.substring(i, i + k)) | 0;
		var mutates;
		if (mutatesCache[actual]) {
			mutates = mutatesCache[actual]
		}
		else {
			mutates = mutate(actual, mRate, powers, k);
			mutatesCache[actual] = mutates;
		}
		for (var mut in mutates) {
			if (!count[mut]) {
				count[mut] = 0;
			}

			count[mut]++;

			if (count[mut] > max) {
				max = count[mut];
				champions = [];
			}


			if (count[mut] == max) {
				champions[mut] = 1;
			}
		}

		// console.log('actual', actual);
		// var red = count.map(function (el, idx) {
			
		// 	if (el === max)
		// 	return deNum(idx, k) + ": " + el;
		// 	else return "";
		// }).reduce(function (acc, el) {
		// 	if (el) {
		// 		acc.push(el);
		// 	}

		// 	return acc;
		// }, []).toString();
		// red && console.log('after round', red);
	}

	// console.log(Object.keys(champions));

	champions = Object.keys(champions).map(function (el) {
		return deNum(el, k);
	});

	write('out', champions.join(' '));

	console.log('Finished in ' + +((new Date().getTime() - start) / 1000) + 'sec');
});

function mutate(num, k, powers, k0) {
	var mutates = [];

	mutateInt(num, k, powers, [], mutates);

	// console.log('mutates of', deNum(num, k0), 'with distance', k, 'are', Object.keys(mutates).map(function (el) {return deNum(el, k0);}).toString());
	return mutates;
}

function mutateInt(num, k, powers, already, mutates) {
	function add() {
		mutates[num] = 1;
	}

	if (!k) {
		add()
	} else {
		add();

		for (var i = 0; i < powers.length; i++) {
			if (already[i]) {
				continue;
			}
			else {
				var copy = [];

				for (key in already) {
					copy[key] = 1;
				}
				copy[i] = 1;
				mutateAt(num, k - 1, powers, i, copy, mutates);
			}
		}
	}
}

function mutateAt(num, count, powers, i, already, mutates) {
	var splittingPower = powers[i];
	var separatingPower = powers[powers.length - 2];
	var lowerDigits = num % splittingPower;
	var higherDigits = (num / splittingPower) | 0;
	higherDigits = (higherDigits / separatingPower) | 0;
	higherDigits = higherDigits * separatingPower;
	var clearednum = higherDigits * splittingPower;
	clearednum += lowerDigits;


	for (var letter in letters) {
		var copy = clearednum;
		if (letter != 0) {
			// console.log('before mutation', Number(num).toString(4));
			// console.log('mutatin at', i);
			// console.log('digit', letter);
			// console.log('lower digits', Number(lowerDigits).toString(4));
			// console.log('higher digits', Number(higherDigits).toString(4));
			// console.log('clearednum', Number(clearednum).toString(4));
		}
		
		copy += splittingPower * letter;
		// console.log('after mutation', Number(copy).toString(4));
		mutateInt(copy, count, powers, already, mutates);
	}
}



function toNum(str) {
	return parseInt(str.replace(/A/g, '0').replace(/T/g, '1').replace(/C/g, '2').replace(/G/g, '3'), 4);
}

function deNum(num, k) {
	var str = Number(num).toString(4).replace(/0/g, 'A').replace(/1/g, 'T').replace(/2/g, 'C').replace(/3/g, 'G');
	while (str.length < k)
		str = 'A' + str;

	return str;
}