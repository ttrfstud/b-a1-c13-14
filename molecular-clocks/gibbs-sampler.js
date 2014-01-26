var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var rand = require('./random');
var p = require('./log');

read('subtle', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	var k = parseInt(d[0].split(' ')[0]);
	var t = parseInt(d[0].split(' ')[1]);
	var N = parseInt(d[0].split(' ')[2]);

	dna = d.slice(1);

	var motifs = [];
	var bestmotifs = [];

	bestmotifs = gibbsSampler(dna, k, t, N);

	for (var i = 0; i < 1999; i++) {
		motifs = gibbsSampler(dna, k, t, N);

		if (score(motifs) < score(bestmotifs)) {
			bestmotifs = motifs;
		}
	}

	write('out', bestmotifs.join('\n'));
});

function gibbsSampler(dna, k, t, N) {

	var bestMotifs = [];

	for (var i = 0; i < dna.length; i++) {
		bestMotifs.push(dna[i].substr(randomInt(dna[i].length - k), k));
	}

	var motifs = bestMotifs.slice(0);

	var profile;

	for (var i = 1; i < N; i++) {
		var i1 = randomInt(t - 1);

		motifs.splice(i1, 1);

		profile = makeProfile(motifs);
		motifs.splice(i1, 0, profileRandom(profile, dna[i1]));

		if (score(motifs) < score(bestMotifs)) {
			bestMotifs = motifs;
		}
	}

	p('best motifs score', score(bestMotifs));
	p('elapsed iterations', i);

	return bestMotifs;
}

function makeProfile(motifs) {
	var profile = [];
	var as, cs, gs, ts;

	for (var pos = 0; pos < motifs[0].length; pos++) {
		as = 0, cs = 0, gs = 0, ts = 0;
		for (var i = 0; i < motifs.length; i++) {
			var letter = motifs[i][pos];

			switch(letter) {
				case 'A' : as++; break;
				case 'C' : cs++; break;
				case 'G' : gs++; break;
				case 'T' : ts++; break;
			}
		}

		// Pseudocounts
		as++, cs++, gs++, ts++;

		as /= (motifs[0].length + 4);
		cs /= (motifs[0].length + 4);
		gs /= (motifs[0].length + 4);
		ts /= (motifs[0].length + 4);

		profile.push([as, cs, gs, ts]);
	}

	return profile;
}

var map = {'A' : 0, 'C' : 1, 'G' : 2, 'T' : 3};

function profileRandom(profile, str) {
	var probs = [];
	var prob;

	for (var i = 0; i < str.length; i++) {
		var kmer = str.substr(i, profile.length);

		if (kmer.length === profile.length) {
			prob = 1;

			for (var j = 0; j < kmer.length; j++) {
				prob *= profile[j][map[kmer[j]]];
			}

			probs.push(prob);
		}
	}

	var idx = rand.apply(null, probs);

	var kmer = str.substr(idx, profile.length);

	return kmer;
}

function score(motifs) {
	var score = 0;
	var as, cs, gs, ts;

	for (var pos = 0; pos < motifs[0].length; pos++) {
		as = 0; cs = 0; gs = 0; ts = 0;

		for (var i = 0; i < motifs.length; i++) {
			var letter = motifs[i][pos];

			switch(letter) {
				case 'A' : as++; break;
				case 'C' : cs++; break;
				case 'G' : gs++; break;
				case 'T' : ts++; break;
			}
		}

		score += as + cs + gs + ts - Math.max(as, cs, gs, ts);
	}

	return score;
}

function randomInt(scale) {
	return Math.floor(Math.random() * scale);
}