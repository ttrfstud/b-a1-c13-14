var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var km = require('./most-frequent-kmers-req');

read('data', {encoding: 'utf8'}, function (err, data) {

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
		
	write('out', skew.join(' '));

});