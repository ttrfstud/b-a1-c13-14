var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var dnaToComplement = {
	'A':'T',
	'T':'A',
	'C':'G',
	'G':'C'
};

read('rna-codon-table', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '');
	d = d.split('\n');

	d = d.map(function (s) {
		return s.split(' ');
	});

	var table = {};

	d.forEach(function (pair) {
		table[pair[0].replace(/U/g, 'T')] = pair[1];
	});

	read('data', {encoding: 'utf8'}, function (e, d) {
		d = d.replace(/\r/g, '').split('\n');
		var dna = d[0];
		var peptide = d[1];

		console.log(peptide);

		var copy, copyc;
		var pcodon, pccodon;

		var cdna = rcomplementary(dna);

		var seqs = [];

		var cursq = '', ccursq = '';

		for (var frame = 0; frame < 3; frame++) {
			copy = peptide;
			ccopy = peptide;

			for (var j = frame; j < dna.length; j += 3) {
				// console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;ccopy', ccopy);
				pcodon = dna.substr(j, 3);
				pccodon = cdna.substr(j, 3);

				if (!copy.length) {
					copy = peptide;
					seqs.push(cursq);
					cursq = '';
				}

				// console.log(ccopy.length, '`````````````````````````````````11111');
				if (!ccopy.length) {
					ccopy = peptide;
					// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!`````````````````````');
					seqs.push(ccursq);
					ccursq = '';
				}

				if (pcodon.length !== 3) break;

				// console.log('dna', dna);
				// console.log('cdna', cdna);
				// console.log('currnt pcodon', pcodon);
				// console.log('currnt copy', copy);
				// console.log('@table:', table[pcodon]);
				// console.log('currnt pccodon', pccodon);
				// console.log('currnt ccopy', ccopy);
				// console.log('@tablec:', table[pccodon]);
				if (copy[0] === table[pcodon]) {
					copy = copy.substring(1);
					cursq += pcodon;
				} else {
					copy = peptide;
					cursq = '';
				}

				if (ccopy[0] === table[pccodon]) {
					ccopy = ccopy.substring(1);

					// console.log('----------------------------------');
					ccursq = rcomplementary(pccodon) + ccursq;
					// console.log('!!!!!!!!!!!!!!!!!!');
					// console.log('!!!!!!!!!ccopy', ccopy);
				} else {
					ccopy = peptide;
					ccursq = '';
				}


			}
		}

		write('out', seqs.join('\n'));
	});
});

function rcomplementary(text) {
	return text.

		split('').
		reverse().
		join('').
		replace(/A/g, '1').
		replace(/T/g, 'A').
		replace(/1/g, 'T').
		replace(/C/g, '1').
		replace(/G/g, 'C').
		replace(/1/g, 'G');
}