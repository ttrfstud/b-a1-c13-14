process.stdin.resume();

var map = {
	"al" : 0,
	"am" : 1,
	"e" : 2,
};

process.stdin.on('data', function (string) {
	string = string.toString().split(' ');

	var p = parseFloat(string[0]);

	var q = 1 - p;

	var n = parseInt(string[1]);
	var m = parseInt(string[2]);
	var flag = map[string[3].replace(/[\r\n]/g, '')];

	console.log(p, n, m, flag);
	
	if (typeof flag === 'undefined') throw new Error();

	var range = makeRange(n, m, flag);

	console.log('range', JSON.stringify(Object.keys(range)));

	var prob = 0;
	for (var i in range) {
		prob += binomial(n, i) * Math.pow(p, i) * Math.pow(q, n - i);
	}

	process.stdout.write('Prob. is : ' + prob);
});

function makeRange(n, m, flag) {
	var range = [];
	if (flag === 0) {
		for (var i = m; i <= n; i++) {
			range[i] = 1;
		}

		return range;
	} else if (flag === 1) {
		for (var i = 0; i <= m; i++) {
			range[i] = 1;
		}
	} else {
		range[m] = 1;
	}

	return range;
}

function binomial(n, k) {
	var c = [];

	for (var i = 0; i <= n; i++) {
		for (var j = 0; j <= Math.min(i, k); j++) {
			if (!c[i]) c[i] = [];
			if (j === 0 || j === i) {
				c[i][j] = 1;
			} else {
				c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
			}
		}
	}

	return c[n][k];
}