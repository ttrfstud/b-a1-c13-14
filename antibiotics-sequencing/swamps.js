var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var imt = [];

var ERROR = 0.4;

/ * This is fun. I tried deSwamping, i tried leaving it
	as-is and of course I failed :) */

read('data', {encoding: 'utf8'}, function (e, d) {
	var spectrum = list(d.split('\n')[2]);
	var N = parseInt(d.split('\n')[1]);
	var M = parseInt(d.split('\n')[0]);

	formImt(d.split('\n')[2], M, function (sp) {
		spectrum = list(sp.join(' '));
	});

	console.log(s(Object.keys(spectrum)));

	var parentMass = spectrum.length - 1;

	var leaderboard = [[]];

	leaderboard[0].score = 0;

	var leaders = [];
	var leaderScore = 0;
	var nextboard = [];

	var f = imt;

	while (leaderboard.length) {
		leaderboard = expand(leaderboard, f, spectrum);

		for (var i in leaderboard) {
			if (leaderboard[i].mass > parentMass + ERROR) continue;
			if (leaderboard[i].mass <= parentMass + ERROR || leaderboard[i].mass >= parentMass - ERROR) {
				if (leaderboard[i].score > leaderScore) {
					leaderScore = leaderboard[i].score;
					leaders = [];
					leaders.push(leaderboard[i]);
				}

				if (leaderboard[i].score === leaderScore && !contains(leaders, leaderboard[i])) {
					leaders.push(leaderboard[i]);
				}
			}
			nextboard.push(leaderboard[i]);
		}

		leaderboard = cut(nextboard, N);
		nextboard = [];
	}

	write('out', leaders.map(function (e) { return e.join('-')}).join(' '));
	write('out', '\n' + leaders.length, {flag: 'a'});
	write('out', '\n' +  leaders.map(function (e) { return e.score; }).join(' '), {flag: 'a'});
});

function formImt(spectrum, M, cb) {
	console.log('formin imt');
	var convolution = [];

	function sort(a, b) {
		return a > b && 1 || a < b && -1 || 0;
	}

	spectrum = spectrum.split(' ').map(function (e) {
		return parseFloat(e);
	});

	if (spectrum.indexOf(0) === -1) spectrum.unshift(0);

	spectrum.sort(sort);

	for (var i = 0; i < spectrum.length; i++) {
		for (var j = 0; j < i; j++) {
			if (spectrum[i] - spectrum[j])
				convolution.push(spectrum[i] - spectrum[j]);
		}
	}

	console.log('sortedspectrum', s(spectrum));

	// convolution = deSwamp(convolution, 0.02);

	convolution.sort(sort);

	console.log('convosize', convolution.length);

	convolution = convolution.filter(function (e) {
		return e >= 57 - ERROR && e <= 200 + ERROR;
	});

	console.log('\nsortedconvolution', s(convolution));
	console.log('\nM', M);

	var squeeze = [];

	for (var i = 0; i < convolution.length; i++) {
		if (!squeeze[convolution[i]]) {
			squeeze[convolution[i]] = {idx: convolution[i], count: 0};
		}

		squeeze[convolution[i]].count++;
	}

	squeeze = squeeze.reduce(function (a, e) {
		a.push(e);
		return a;
	}, []);

	console.log('\nsqueeze', s(squeeze));
	function sortSqueeze(a, b) {
		return a.count < b.count && 1 || b.count < a.count && -1 || 0;
	}

	squeeze.sort(sortSqueeze);
	console.log('\nsortedsqueeze', s(squeeze));

	var sl = squeeze.slice(0, M);

	function initImt() {
		sl.forEach(function (e) {
			if (!imt[e.idx]) {
				imt[e.idx] = 1;
			}
		});

		console.log('\nimt', s(Object.keys(imt)));


		// spectrum = deSwamp(spectrum, 0.01);
		spectrum.push(1322);
		cb(spectrum);
		console.log(s(spectrum));
	}

	if (!sl.length || squeeze.length <= M) {
		initImt();
		return;
	}

	var last = sl[sl.length - 1].count;

	var i = M;

	while(squeeze[i].count === last) {
		sl.push(squeeze[i]);
		i++;
	}

	console.log('\nsl', s(sl));
	initImt();
}

function deSwamp(swamp, dist) {
	var swamps = [];
	var currentSwamp = [];

	function inPercentDistance(v1, v2) {
		var diff = Math.abs(v1 - v2);
		// console.log('diff', diff);
		// console.log('rel', diff / anchor);
		return (diff / anchor) <= dist;
	}

	var anchor;
	var prev;
	// console.log('init swamp', s(swamp));
	for (var i = 0; i < swamp.length; i++) {
		// console.log('curr', swamp[i]);
		// console.log('anchor', anchor);
		
		if (!anchor || !inPercentDistance(anchor, swamp[i])) {
			if (currentSwamp.length) swamps.push(currentSwamp);
			currentSwamp = [];
			anchor = swamp[i];
		}

		if (!prev || !(prev - swamp[i] < 1)) {
			currentSwamp.push(swamp[i]);
		}			
	}

	// console.log('dissected swamps', s(swamps));
	function avg(swamp) {
		var avg = 0;

		for (var i = 0; i < swamp.length; i++) {
			avg += swamp[i];
		}
		
		avg = avg / swamp.length;

		for (i = 0; i < swamp.length; i++) {
			if (swamp[i] > avg) break;
		}

		var ceilOrFloor = (swamp.length - i) > (i + 1) ? 'ceil' : 'floor';

		avg = Math[ceilOrFloor](avg);
		// console.log('avg for', s(swamp), 'is', avg);
		return avg;
	}

	var averages = [];

	for (var i = 0; i < swamps.length; i++) {
		averages.push(avg(swamps[i]));
	}

	return averages;
}

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
	function scoreSort(a, b) {
		return a.score > b.score && -1 || a.score < b.score && 1 || 0;
	}

	board.sort(scoreSort);

	var sl = board.slice(0, N);

	if (!sl.length || board.length <= N) {
		return sl;
	}


	var lastScore = sl[sl.length - 1].score;

	var i = N;
	while (board[i] && (board[i].score === lastScore)) {
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

function s(a) {
	return JSON.stringify(a);
}

function score(pep, spectrum) {
	if (!pep.length) return 0;

	pep = toSpectrum(pep);
	spectrum = spectrum.slice(0);

	var score = 0;

	for (var i = 0; i < pep.length; i++) {
		for (var j = pep[i] - ERROR; j <= pep[i] + ERROR; j += 0.1) {
			if (spectrum[j]) {

				spectrum[j]--;
				score++;
				break;
			}
		}	
	}

	return score;
}

function toSpectrum(pep) {
	var sps = [];
	var sp = 0;

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

	var spectrum = [];

	for (var i = 0; i < sps.length; i++) {
		spectrum.push(mass(sps[i]));
	}

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