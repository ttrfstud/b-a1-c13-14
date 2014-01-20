var read = require('fs').readFile;
var write = require('fs').writeFileSync;
var bash = require('child_process').spawn;

function log(msg) {
	write('log', msg + '\n', {flag: 'a'});
}

read('data', {encoding: 'utf8', flag: 'r'}, function (err, data) {

	var genome = data.split('\n');
	genome.unshift();

	// log('genome');
	// log(genome.toString());
	genome = genome.join('').replace(/\r/g, '');

	// log('genome2');
	// log(genome.toString());

	log(genome.indexOf('\n'));

	var pos = parseInt(process.argv[2], 10);

	var SIZE = 500;

	var startingWindow, centeredWindow, endingWindow;

	var dataout = [];

	startingWindow = genome.substr(pos, SIZE);

	var difference;

	var realStartingStart = pos;
	var realStartingEnd = pos + SIZE;

	if (startingWindow.length < SIZE) {
		difference = SIZE - startingWindow.length;

		startingWindow += genome.substr(0, difference);

		realStartingEnd = difference;
	}

	//3818757
	// pos - SIZE : 3818259
	// pos + SIZE : 38187595
	// log(pos + SIZE);

	var centeredStart = pos - SIZE / 2;
	//3818507

	// log(centeredStart);
	var centeredEnd = pos + SIZE / 2;
	//3818509

	// log(centeredStart);
	//5207420

	// log(genome.length);

	//3818757

	// log(pos);



	var realCenteredStart = centeredStart >= 0 ? centeredStart : 0;
	var realCenteredEnd = centeredEnd <= genome.length ? centeredEnd : genome.length;

	centeredWindow = genome.substring(realCenteredStart, realCenteredEnd);

	if (centeredStart < 0) {
		difference = Math.abs(centeredStart);

		centeredWindow = genome.substring(genome.length - difference, genome.length) + centeredWindow;

		realCenteredStart = genome.length - difference;
	}

	if (centeredEnd > genome.length) {
		difference = centeredEnd - genome.length;
		centeredWindow += genome.substring(0, difference);

		realCenteredEnd = difference;
	}

	var endingStart = pos - SIZE;

	var realEndingStart = endingStart >= 0 ? endingStart : 0;
	var realEndingEnd = pos;

	endingWindow = genome.substring(realEndingStart, pos);

	if (endingStart < 0) {
		difference = Math.abs(endingStart);

		endingWindow = genome.substring(genome.length - difference, genome.length) + endingWindow;

		realEndingStart = genome.length - difference;
	}



	log(startingWindow.indexOf('\n'));
	log(centeredWindow.indexOf('\n'));
	log(endingWindow.indexOf('\n'));

	// Assertions ...
	if (startingWindow.length !== SIZE)
		throw new Error ('Starting window! ' + startingWindow.length);

	if (centeredWindow.length !== SIZE)
		throw new Error ('Centered window!' + centeredWindow.length);

	if (endingWindow.length !== SIZE)
		throw new Error ('Ending window' + endingWindow.length);

	var kids = [];


	log('startingWindow');
	log(startingWindow);
	log('centeredWindow');
	log(centeredWindow);
	log('endingWindow');
	log(endingWindow);

	var windows = [
		{
			w: startingWindow,
			s: realStartingStart,
			e: realStartingEnd
		}, 
		{
			w: centeredWindow,
			s: realCenteredStart,
			e: realCenteredEnd
		}, 
		{	
			w: endingWindow,
			s: realEndingStart,
			e: realEndingEnd
		}];

	var currentMax = -1;

	for (var i = 0; i < 3; i++) {
		var kid = bash('node', ['kmer-slave.js', windows[i].w, windows[i].s, windows[i].e]);

		kid.stdout.on('data', function (data) {
			log(data);
			var json = JSON.parse(data);

			if (json.size > currentMax) {
				dataout = [];
				currentMax = json.size;
			}

			if (json.size === currentMax) {
				dataout.push(json);
			}
		})

		kid.stderr.on('data', function (err) {
			throw new Error(err);
		});

		kid.on('exit', (function (kid) {
			return function () {
				kid.terminated = true;
			}
		} (kid)));	

		kids.push(kid);
	}

	var id = setInterval(function () {
		var allTerminated = true;
		for (var i = 0; i < kids.length; i++) {
			if (!kids[i].terminated) {
				allTerminated = false;
				// log('kid[' + i + '] is not terminated');
				break;
			}

			// log('kid[' + i + '] is terminated');
		}

		if (allTerminated) {
			clearTimeout(id);
			log('dataout');
			log(dataout.toString());
			console.log(JSON.stringify(dataout));
		}
	}, 10);
});