module.exports = function () {
	var args = [].slice.call(arguments, 0);

	var sum = args.reduce(function (a, b) { if (b < 0) throw new Error(); return a + b; });

	var probs = args.map(function (e) { return e / sum; });

	var cumulative = probs.reduce(function (a, e) {
		return a.concat(a[a.length - 1] + e);
	}, [0])

	if (cumulative[cumulative.length - 1] !== 1) {
		cumulative[cumulative.length - 1] = 1;
	}

	var seed = Math.random();

	for (var i = 0; i < probs.length; i++) {
		if (seed >= cumulative[i] && seed < cumulative[i + 1]) {
			return i; // index is of bigger importance, since args may contain indistinguishable duplicates
		}
	}

	throw new Error();
}