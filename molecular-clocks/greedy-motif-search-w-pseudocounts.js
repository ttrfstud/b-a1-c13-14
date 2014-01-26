var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var p = require('./log');

var map = {'A': 0, 'C': 1, 'G': 2, 'T': 3};

read('data', {encoding: 'utf8'}, function (e, d) {
	d = d.replace(/\r/g, '').split('\n');

	var k = parseInt(d[0].split(' ')[0]);
	var t = parseInt(d[0].split(' ')[1]);

	var dna = d.slice(1);

	var bestMotifs = [];

	for (var i = 0; i < dna.length; i++) {
		bestMotifs.push(dna[i].substr(0, k));
	}

	var motifs = [];
	var motif = '';
	var profile;

	for (i = 0; i < dna[0].length; i++) {
		motif = dna[0].substr(i, k);

		if (motif.length !== k) continue;

		p('dna0', dna[0]);
		p('motif', motif);
		motifs.push(motif);
		p('inside loop', '---------------------');
		for (var j = 1; j < dna.length; j++) {
			profile = formProfile(motifs);
			p('profile', profile);
			motif = mostProbable(dna[j], profile);
			p('motif', motif);
			motifs.push(motif);
		}
		p('outside loop', '---------------------');

		if (score(motifs) < score(bestMotifs)) {
			bestMotifs = motifs;
		}

		motifs = [];
	}

	write('out', bestMotifs);
});


function formProfile(motifs) {
	var as, ts, gs, cs;

	var profile = [];

	for (var position = 0; position < motifs[0].length; position++) {
		as = 0, ts = 0, gs = 0, cs = 0;
		
		for (var j = 0; j < motifs.length; j++) {
			switch(motifs[j][position]) {
				case 'A': as++; break;
				case 'C': cs++; break;
				case 'G': gs++; break;
				case 'T': ts++; break;
			}
		}

		as++, cs++, gs++, ts++;

		as /= motifs.length;
		ts /= motifs.length;
		gs /= motifs.length;
		cs /= motifs.length;

		// More accurately:
		// as /= (motifs.length + 4);
		// ts /= (motifs.length + 4);
		// gs /= (motifs.length + 4);
		// cs /= (motifs.length + 4);

		profile.push([as, cs, gs, ts]);
	}

	return profile;
}

function mostProbable(dnastring, profile) {
	var maxProb = 0;
	var prob;
	var champions = [];

	for (var i = 0; i < dnastring.length; i++) {
		var kmer = dnastring.substr(i, profile.length);

		if (kmer.length === profile.length) {
			var prob = 1;

			for (var j = 0; j < kmer.length; j++) {
				prob *= profile[j][map[kmer[j]]]; 
			}

			if (prob > maxProb) {
				maxProb = prob;
				champions = [];
			}

			if (prob === maxProb) {
				champions.push(kmer);
			}
		}	
	}

	return champions[0];
}

function score(motifs) {
	var score = 0;
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

		var max = -1;
		var counts = [as, cs, gs, ts];

		for (var i = 0; i < counts.length; i++) {
			if (max < counts[i]) max = counts[i];
		}

		var unprobableCount  = as + cs + gs + ts - max;
		score += unprobableCount;
	}

	return score;
}