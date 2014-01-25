var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var imt = [];

for (var i = 57; i <= 200; i++) imt[i] = 1;

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
					leaders = [];
					leaders.push(leaderboard[i]);
				}

				if (leaderboard[i].score === leaderScore && !contains(leaders, leaderboard[i])) {
					leaders.push(leaderboard[i]);
				}
			}



			var nextl, nextls = 0;

			for (var k = 0; k < nextboard.length; k++) {
				if (nextls < nextboard[k].score) {
					nextls = nextboard[k].score;
					nextl = nextboard[k];
				}

			}

			test3(leaderboard[i]) && console.log(s(leaderboard[i]), 'A1');
			test3(leaderboard[i]) && console.log(leaderboard[i].score, 'A2');
			test3(leaderboard[i]) && console.log(JSON.stringify(nextl), 'A3');
			test3(leaderboard[i]) && console.log(nextls, 'A4');

			// test1(leaderboard[i]) && console.log(s(leaderboard[i]), 'f1');
			// test1(leaderboard[i]) && console.log(leaderboard[i].score, 'f2');
			// test1(leaderboard[i]) && console.log(JSON.stringify(nextl), 'f3');
			// test1(leaderboard[i]) && console.log(nextls, 'f4');

			nextboard.push(leaderboard[i]);
		}

		leaderboard = cut(nextboard, N);
		nextboard = [];
	}

	write('out', leaders.map(function (e) { return e.join('-')}).join(' '));
	// write('out', '\n' + leaders.length, {flag: 'a'});
	// write('out', '\n' + leaders[0].score, {flag: 'a'});
});

function contains(a, e) {
	for (var i = 0; i < a.length; i++) {
		if (same(a[i], e)) return true;
	}

	return false;
}

function same(a1, a2) {
	if (a1.length !== a2.length) {
		return false;
	}

	for (var i = 0; i < a1.length; i++) {
		if (a1[i] !== a2[i]) return false;
	}

	return true;
}

function cut(board, N) {
	// console.log('board bf', JSON.stringify(board.map(function (el) { return el.score; })));

	function scoreSort(a, b) {
		return a.score > b.score && -1 || a.score < b.score && 1 || 0;
	}

	board.sort(scoreSort);

	// console.log('board afta', JSON.stringify(board.map(function (el) { return el.score; })));
	// console.log('N', N);

	var sl = board.slice(0, N);

	// console.log(JSON.stringify(sl.map(function (e) { return e.score; })), sl.length);

	if (!sl.length || board.length <= N) {
		return sl;
	}


	var lastScore = sl[sl.length - 1].score;

	var i = N;

	while (board[i].score === lastScore) {
		sl.push(board[i]);
		i++;
	}

	// console.log(JSON.stringify(sl.map(function (e) { return e.score; })), sl.length);

	return sl;
}

/* Error was here ! We can't filter imt with shaky spectrum !*/
function filter(imt, spectrum) {
	return imt;
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

function test3(ar) {

	return false;
	// 147,97,186,147,114,128,163,99,128,	
	return ar.length === 10 &&
	ar[0] === 147 && ar[1] === 97 && ar[2] === 186 &&
	ar[3] === 147 && ar[4] === 114 && ar[5] === 128&&
	ar[6] === 163 && ar[7] === 99 && ar[8] === 128;
}

function s(a) {
	return JSON.stringify(a);
}

function score(pep, spectrum) {
	var orig = pep;

	if (!pep.length) return 0;

	pep = toSpectrum(pep);
	spectrum = spectrum.slice(0);

	test3(orig) && console.log('');
	test3(orig) && console.log('');
	test3(orig) && console.log('');
	test3(orig) && console.log(s(pep), 'spectrkm')
	test3(orig) && console.log(s(pep.length), 'spectrkm-len')
	test3(orig) && console.log(s(Object.keys(spectrum)), 'spectrkm')
	orig.spectrum = pep;

	var score = 0;

	for (var i = 0; i < pep.length; i++) {
		if (spectrum[pep[i]]) {
			test3(orig) && console.log('peppin', spectrum[pep[i]], pep[i]);

			spectrum[pep[i]]--;
			score++;
		} else test3(orig) && console.log('peppin not there', spectrum[pep[i]], pep[i]);

	}

	test3(orig) && console.log(score, 'score')
	return score;
}

function toSpectrum(pep) {
	var sps = [];
	var sp = 0;

	// console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&');
	// console.log(JSON.stringify(pep));

	for (var i = 1; i < pep.length; i++) {
		for (var j = 0; j < pep.length; j++) {
			sp = pep.slice(j, j + i);

			if (sp.length < i) {
				var diff = i - sp.length;
				sp = sp.concat(pep.slice(0, diff));
			}

			sps.push(sp);
		}
	}

	sps.push([0]);
	sps.push([mass(pep)]);

	// console.log(JSON.stringify(sps));

	var spectrum = [];

	for (var i = 0; i < sps.length; i++) {
		spectrum.push(mass(sps[i]));
	}

	// console.log('spectrum', JSON.stringify(spectrum));
	
	// console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
	// console.log('');

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
	});

	return lst;
}