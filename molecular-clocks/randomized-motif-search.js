var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var p = require('./log');


var THE_SUN_IS_ALIVE = true;

read('data', {encoding: 'utf8'}, function (e, d) {

	d = d.replace(/\r/g, '').split('\n');

	var k = d[0].split(' ')[0];
	var t = d[0].split(' ')[1];

	var dna = d.slice(1);

	p('dna', dna);

	var dnaStringLength = dna[0].length;

	p('dna string length', dnaStringLength);

	var bestMotifs = [];
	var motifs;

	for (var i = 0; i < dna.length; i++) {
		var seed = Math.floor(Math.random() * (dnaStringLength - k));

		bestMotifs.push(dna[i].substr(seed, k));
	}

	p('random best motifs', bestMotifs);

	motifs = bestMotifs;

	var profile;

	while (THE_SUN_IS_ALIVE) {
		p('\n===================================', '``````````````');
		p('motifs', motifs);
		profile = makeProfile(motifs);
		p('profile', profile);
		motifs = motifsy(profile, dna);

		if (score(motifs) < score(bestMotifs)) {
			bestMotifs = motifs;
		} else {
			break;
		}
	}

	write('out', bestMotifs.join('\n'));
});

function makeProfile(motifs) {
	var profile = [];
	var as, ts, cs, gs;

	p('\t computin profile for', motifs);
	for (var pos = 0; pos < motifs[0].length; pos++) {
		as = 0, cs = 0, gs = 0, ts = 0;

		p('\tsetting as...ts to zero', '');
		for (var i = 0; i < motifs.length; i++) {
			var letter = motifs[i][pos];

			p('\t\tletter is', letter);
			p('\t\tin', motifs[i]);
			p('\t\t@', pos);
			switch(letter) {
				case 'A' : as++; break;
				case 'C' : cs++; break;
				case 'G' : gs++; break;
				case 'T' : ts++; break;
			}

			p('\t\t[as,cs,gs,ts]', [as, cs, gs, ts]);
		}

		// Pseudocounts maybe ?
		as++, gs++, cs++, ts++;
		as /= motifs.length;
		cs /= motifs.length;
		gs /= motifs.length;
		ts /= motifs.length; // More accurately...
		profile.push([as, cs, gs, ts]);
	}

	return profile;
}

function motifsy(profile, dna) {
	var motifs = [];

	for (var i = 0; i < dna.length; i++) {
		motifs.push(mostProbable(profile, dna[i]));
	}

	return motifs;
}

var map = {'A' : 0, 'C' : 1, 'G' : 2, 'T' : 3};

function mostProbable(profile, str) {
	var prob, maxProb = -1;
	var champion;

	p('\tmost probable in ', str);
	p('\taccording to profile ', profile);
	for (var i = 0; i < str.length; i++) {
		var kmer = str.substr(i, profile.length);

		if (kmer.length === profile.length) {
			prob = 1;

			for (var j = 0; j < kmer.length; j++) {
				prob *= profile[j][map[kmer[j]]];
			}

			if (prob > maxProb) {
				maxProb = prob;
				champion = kmer;
			}

			p('\t\tprobability of kmer', kmer);
			p('\t\tis', prob);
		}
	}

	p('\tis', champion);

	return champion;
}

function score(motifs) {
	var score = 0;

	var as, cs, gs, ts;

	p('\tscoring', motifs);
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


		var max = Math.max(as, cs, gs, ts);
		p('\t\tscore at pos', pos);
		p('\t\tis', as + cs + gs + ts - max);
		score += as + cs + gs + ts - max;
	}

	p('\ttotal is', score);
	return score;
}