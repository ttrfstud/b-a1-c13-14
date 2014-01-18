var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var km = require('./most-frequent-kmers-req');

read('data', {encoding: 'utf8'}, function (err, data) {
	var startTime = new Date().getTime();
	var split = data.split('\n');
	var genome = split[0];
	var ints = split[1];

	var k = parseInt(ints.split(' ')[0], 10);
	var L = parseInt(ints.split(' ')[1], 10)|0;
	var t = parseInt(ints.split(' ')[2], 10)|0;
	genome = toNumber(genome);

	var window = genome.substring(i).substring(0, L);
	var kmResult = km.km(window, k, t);


	var trim = km.trim;
	var clumping = kmResult.clumping;
	var freqs = kmResult.freqs;
	var newKmer = kmResult.last|0;
	var prevStart =  k + 1;
	var prevFirst = kmResult.first|0;
	var power = km.power|0;
	var len = genome.length;

	for (var i = L; i < len; i++, prevStart++) {
		console.log(genome.length, genome, i);
		var newKmer = trim(newKmer, power) * 10 + parseInt(genome[i]);

		console.log(newKmer);
		var prevFirst = trim(prevFirst, power) * 10 + parseInt(genome[prevStart]);

		if (freqs[prevFirst]) {
			freqs[prevFirst]--;
		}

		// If it is already clumping we dont need it
		if (clumping[newKmer]) 
			continue;

		if (freqs[newKmer]) {
			freqs[newKmer]++;
			if (freqs[newKmer] >= t) {
				clumping[newKmer] = 1;
			}
		} else {
			freqs[newKmer] = 1;
		}
	}

	write('out', Object.keys(clumping).length);

	var time = new Date().getTime() - startTime;
	console.log('Done in ' + +(time / 1000) + ' s');
});

function toNumber(genome) {
	return genome.replace(/A/g, '0').replace(/T/g, '1').replace(/C/g, '2').replace(/G/g, '3').replace('\r', '');
}