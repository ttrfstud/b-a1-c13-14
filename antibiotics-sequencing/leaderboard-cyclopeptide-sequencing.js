var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('imt2', {encoding: 'utf8'}, function (e, d) {

	var imt = list(d);

	read('data', {encoding: 'utf8'}, function (e, d) {
		var spectrum = list(d.split('\n')[0]);
		var N = parseInt(d.split('\n')[1]);

		var parentMass = spectrum.length - 1;

		var leaderboard = [[]];

		leaderboard[0].score = 0;

		var leader = [];
		var leaders = [];
		var leaderScore = 0;
		var nextboard = [];

		var f = filter(imt, spectrum);

		while (leaderboard.length) {
			leaderboard = expand(leaderboard, f, spectrum);

			// console.log('lb', JSON.stringify(leaderboard));
			for (var i in leaderboard) {
				// console.log('contender', JSON.stringify(leaderboard[i]));
				// console.log('score', leaderboard[i].score);
				// console.log('spectrum', JSON.stringify(leaderboard[i].spectrum));
				// console.log('spectrum', JSON.stringify(Object.keys(spectrum)));
				// console.log('mass', leaderboard[i].mass);
				// console.log('parentMass', JSON.stringify(parentMass));

				if (leaderboard[i].mass > parentMass) continue;

				if (leaderboard[i].mass === parentMass) {
					if (leaderboard[i].score > leaderScore) {
						leaderScore = leaderboard[i].score;
						leader = leaderboard[i];
						leaders = [];
						leaders.push(leader);
					}

					if (leaderboard[i].score === leaderScore) {
						leaders.push(leaderboard[i]);
					}
				}

				nextboard.push(leaderboard[i]);
			}

			leaderboard = cut(nextboard, N);
			nextboard = [];
			console.log(JSON.stringify(leader));
			console.log(JSON.stringify(leader.score));
		}

		write('out', JSON.stringify({l: leaders.length, s: leader.score}));
	});
});

function cut(board, N) {
	// console.log('board bf', JSON.stringify(board.map(function (el) { return el.score; })));

	function scoreSort(a, b) {
		return a.score > b.score && -1 || a.score < b.score && 1 || 0;
	}

	board.sort(scoreSort);

	// console.log('board afta', JSON.stringify(board.map(function (el) { return el.score; })));
	// console.log('N', N);

	return board.slice(0, N);
}

function filter(imt, spectrum) {
	var filtered = [];

	for (var i in imt) {
		if (spectrum[i]) filtered[i] = 1;
	}

	return filtered;
}

function expand(board, filter, spectrum) {
	var nu = [];

	for (var i = 0; i < board.length; i++) {
		for (var j in filter) {
			var nl = board[i].concat(j | 0);
			nl.score = score(nl, spectrum); 
			nl.mass = mass(nl);
			nu.push(nl);
		}
	}

	return nu;
}

function mass(pep) {
	if (!pep.length) return 0;

	return pep.reduce(function (a, b) { return a + b; });
}

function score(pep, spectrum) {
	var orig = pep;

	if (!pep.length) return 0;

	pep = toSpectrum(pep);
	spectrum = spectrum.slice(0);

	orig.spectrum = pep;

	var score = 0;

	for (var i = 0; i < pep.length; i++) {
		if (spectrum[pep[i]]) {
			spectrum[pep[i]]--;
			score++;
		}
	}

	return score;
}

function toSpectrum(pep) {
	var spectrum = [];

	for (var i = 0; i < pep.length; i++) {
		var sum = 0;

		for (var j = i; j < pep.length; j++) {
			sum += pep[j];
			spectrum.push(sum);
		}
	}	

	spectrum.unshift(0);

	return spectrum;
}

function list(data) {
	var lst = [];

	data.replace(/[\r\n\t]/g, '').split(' ').forEach(function (e) { 
		var n = parseInt(e);
		if (!lst[n]) {
			lst[n] = 0;
		}

		lst[n]++;
		if (n === 128) console.log(lst[n], '@128');
	});

	return lst;
}