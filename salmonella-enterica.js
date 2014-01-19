var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var bash = require('child_process').spawn;
var ms = require('./min-skew-req');

read('data', {encoding: 'utf8'}, function (err, data) {

	var genome = data.split('\n');
	genome.unshift();
	genome = genome.join('').replace(/\r/g, '');

	console.log(genome.indexOf('\n'));

	var outdata = [];
	var kids = [];

	// The procedure goes as following:
	// 1. Find skew minimum in the genome

	var minPos = ms(genome);

	// If any of two minPos are less than 500 symbols separated, reduce them to one

	var squeezedMinPos = [];
	for (var i = 0; i < minPos.length; i++) {
		var alreadyThere = false;
		for (var j = 0; j < squeezedMinPos.length; j++) {
			if (squeezedMinPos[j] - minPos[i] < 500) {
				alreadyThere = true;
				break;
			}
		}		

		if (!alreadyThere) {
			squeezedMinPos.push(minPos[i]);
		}
	}

	minPos = squeezedMinPos;

	console.log(minPos);

	// 2. If there are a few of them, for each skew minimum start a slave to search near that minimum
	
	for (var i = 0; i < minPos.length; i++) {
		var kid = bash('node', ['window-slave.js', minPos[i]]);
		kid.stdout.on('data', function (data) {
			console.log('data from window slave..');
			console.log('data', data.toString());
			var json = JSON.parse(data.toString());

			outdata = outdata.concat(json);
			console.log('outdata', outdata);
		});

		kid.stderr.on('data', function (err) {
			throw new Error(err);
		});

		kids.push(kid);

		var term = (function (kid) {
			return function () {
				kid.terminated = true;
			}
		}(kid));

		kid.on('exit', term);
		kid.on('close', term);
	}

	// 3. A slave should start 3 slaves to search in the window of width 500  starting (1), ending(2) and centered(3)
	// near that minimum
	// 4. There must be assurance that each slave is equipped with a window of width 500. So if the minimum is too early
	// or too late to be of width 500, it should be complemented to the full width from the opposite  end of genome
	// 5. Each window is examined for mismatched  (+ their reverse complements) most frequent 9-mers, since Salmonella enterica
	// is a close relative of E.coli
	// 6. Each of window slaves returns to parent slave, which aggregates the result and sends it to the host.
	// 7. Host makes a decision. If there were 3 minimums, there would be 9 results. the result is considered best
	// if the frequency of the most frequent k-mer in it is the maximum among all frequencies in all results. If there
	// are multiple maximums, each of them is returned.

	var id = setInterval(function () {
		var allTerminated = true;

		for (var i = 0; i < kids.length; i++) {
			if (!kids[i].terminated) {
				allTerminated = false;
				break;
			}
		}

		var out = [];
		var currentMax = -1;
		if (allTerminated) {
			clearInterval(id);
			for (i = 0; i < outdata.length; i++) {
				var data = outdata[i];

				if (data.size > currentMax) {
					currentMax = data.size;
					out = [];
				}

				if (data.size === currentMax)  {
					out.push(data);
				}

				write('out', JSON.stringify({out: out, minPos: minPos}));
			}
		}
	}, 10);

});