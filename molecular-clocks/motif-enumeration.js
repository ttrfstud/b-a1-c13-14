var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e, data) {
	data = data.replace(/\r/g, '').split('\n');

	var k = parseInt(data[0].split(' ')[0]);
	var d = parseInt(data[0].split(' ')[1]);

	var dna = data.slice(1);

	p('k', k);
	p('d', d);
	p('dna', dna);

	var motifs = [];

	for (var i = 0; i < dna.length; i++) {
		console.log('dfsdfdsf');
		for (var j = 0; j < dna[i].length; j++) {
			var kmer = dna[i].substr(j, k);

			if (kmer.length < k) continue;

			// We have a legitimate kmer

			var mutations = mutate(kmer, d);

			for (var k1 = 0; k1 < mutations.length; k1++) {
				var mutation = mutations[k1];

				// We have legitimate mutation

				var mumu = mutate(mutation, d);

				var present = true;
				for (var i1 = 0; i1 < dna.length; i1++) {
					var pr = false;
					for (var j1 = 0; j1 < mumu.length; j1++) {
						if (dna[i1].indexOf(mumu[j1]) !== -1) {
							pr = true;
							break;
						}
					}

					if (!pr) {
						present = false;
						break;
					};
				}

				if (present) {
					motifs.push(mutation);
				}
			}
		} 
	}

	var noDup = [];

	for (var i = 0; i < motifs.length; i++) {
		if (noDup.indexOf(motifs[i]) === -1) {
			// p('noDup', noDup);
			// p('motif', motifs[i]);
			noDup.push(motifs[i]);
		}
	}

	write('out', noDup.join(' '));
});

function p(msg, obj) {
	console.log(msg, JSON.stringify(obj));
}

function mutate(kmer, mismatchCount) {
	var mutations = [];
	
	mutateInternal(kmer, mismatchCount, mutations, []);

	return mutations;
}

function mutateInternal(kmer, count, ar, ind) {
	if (!count) {
		return;
	} else {
		for (var i = 0; i < kmer.length; i++) {
			if (ind.indexOf(i) === -1) {
				var copy = ind.slice(0);
				copy.push(i);
				at(kmer, i, count - 1, ar, copy);
			}
		}
	}
}

function at(kmer, idx, count, ar, ind) {
	var letters = ['A', 'C', 'G', 'T'];
	for (var i in letters) {
		var letter = letters[i];
		var mu = kmer.substring(0, idx) + 
			letter + 
			kmer.substring( idx + 1, kmer.length)
		ar.push(mu);
	
		mutateInternal(mu, count, ar, ind);
	}


}