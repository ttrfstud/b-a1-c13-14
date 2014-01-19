var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var km = require('./most-frequent-kmers-req');

read('data', {encoding: 'utf8'}, function (err, data) {

	var genome = data.split('genome')[1];

	// The procedure goes as following:
	// 1. Find skew minimum in the genome
	// 2. If there are a few of them, for each skew minimum start a slave to search near that minimum
	// 3. A slave should start 3 slaves to search in the window of width 500  starting (1), ending(2) and centered(3)
	// near that minimum
	// 4. There must be assurance that each slave is equipped with a window of width 500. So if the minimum is too early
	// or too late to be of width 500, it should be complemented to the full width from the opposite  end of genome
	// 5. Each window is examined for mismatched  (+ their reverse complements) most frequent 9-mers, since Salmonella enterica
	// is a close relative of E.coli
	// 6. Each of window slaves returns to parent slave, which aggregates the result and send it to the host.
	// 7. Host makes a decision. If there were 3 minimums, there would be 9 results. the result is considered best
	// if the frequency of the most frequent k-mer in it is the maximum among all frequencies in all results. If there
	// are multiple maximums, each of them is returned.

	write('out', 1);
});