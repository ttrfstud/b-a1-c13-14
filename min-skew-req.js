var read = require('fs').readFile;
var write = require('fs').writeFileSync;

module.exports = function (data) {

	var genome = data.toString();

	var skew = [0];

	for (var i = 0; i < genome.length; i++) {
		if (genome[i] === 'C')
			skew.push(skew[skew.length - 1] - 1);
		else if (genome[i] === 'G')
			skew.push(skew[skew.length - 1] + 1);
		else
			skew.push(skew[skew.length - 1]);

	}
		
	var min = Number.MAX_VALUE;
	for (i = 0; i < skew.length; i++)
		if (skew[i] < min) min = skew[i];

	var minPos = [];

	for (i = 0; i < skew.length; i++)
		if (skew[i] == min)
			minPos.push(i);

	return minPos;
}