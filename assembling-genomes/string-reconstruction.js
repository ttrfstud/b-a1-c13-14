var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var len;

read('data', {encoding: 'utf8'}, function (e,d) {
	d = d.replace(/\r/g, '').split('\n');

	var graph = [];

	for (var i = 0; i < d.length; i++) {
		var line = d[i];

		var from = toInt(line.split(' -> ')[0]);
		var tos = line.split(' -> ')[1];

		graph[from] = [];

		tos = tos.split(',');

		for (var j = 0; j < tos.length; j++) {
			graph[from].push(toInt(tos[j]));
		}
	}

	var pair = balance(graph);

	// console.log(JSON.stringify(graph));
	// console.log('www', 'hi');

	var cycle = [];

	makeCycle(cycle, parseInt(Object.keys(graph)[0]), graph);

	var edge;
	while(typeof(edge = findUnvisited(graph)) !== 'undefined') {
		cycle = remake(cycle, edge);
		makeCycle(cycle, edge, graph);
	}

	// console.log(JSON.stringify(cycle));

	cycle = breac(cycle, pair);
 
	cycle = cycle.map(function (el) { return fromInt(el);});

	var presentation = cycle[0];

	for (var i = 1; i < cycle.length; i++) {
		presentation += cycle[i].substr(-1);
	}

	console.log('presentation', presentation);

	write('out', presentation);
});

function breac(cycle, pair) {
	var among = false;

	for (var i = 0; i < cycle.length - 1; i++) {
		if (pair[cycle[i]] && pair[cycle[i + 1]]) {
			among = true;
			break;
		}
	}

	if (among) {
		var sub1 = cycle.slice(0, i + 1);
		var sub2 = cycle.slice(i + 1); 
		cycle = sub2.concat(sub1);
	}

	return cycle;
}

function balance(graph) {
	var count = [];

	for (var i in graph) {
		if (!count[i]) count[i] = 0;

		count[i] -= graph[i].length;
		for (var j = 0; j < graph[i].length; j++) {
			if (!count[graph[i][j]]) count[graph[i][j]] = 0;

			count[graph[i][j]] += 1;
		}
	}

	var pair = [];
	var to, from;
	for (var i in count) {
		if (count[i]) {
			// console.log(i, '@', count[i]);
			if (count[i] < 0) {
				to = i;
				pair[i] = -1;
			} else {
				from = i;
				pair[i] = 1;
			}
		}
	}

	if (!graph[from]) graph[from] = [];
	graph[from].push(parseInt(to));

	console.log('FROM', from);

	if (Object.keys(pair).length !== 2) {
		throw new Error(JSON.stringify(pair));
	}

	return pair;
}

function remake(cycle, edge) {
	var idx;

	for (var i = 0; i < cycle.length; i++) {
		if (cycle[i] === edge) {
			idx = i; break;
		}
	}

	var sub1 = cycle.slice(0, idx);
	var sub2 = cycle.slice(idx);

	return sub2.concat(sub1);
}

function findUnvisited(graph) {
	for (var i in graph) {
		if (graph[i].length) {
			return parseInt(i);
		}
	}
}

function makeCycle(cycle, edge, graph) {
	var start = edge;
	var next = edge;
	// console.log('\t>>cycle is bifo', JSON.stringify(cycle));
	// console.log('\t>>graph is bifo', JSON.stringify(graph));
	do  {
		prev = next;
		cycle.push(prev);
		console.log('prev', prev);
		next = graph[prev][0];
		graph[prev].splice(0, 1);
		// console.log('next', typeof next, 'start', typeof start, '==', start === next);
	} while (start !== next);	

	// console.log('\t>>cycle is afta', JSON.stringify(cycle));
	// console.log('\t>>graph is afta', JSON.stringify(graph));

}

function fromInt(dnaInt) {
	// console.log('\t>>dnaInt', dnaInt);
	// console.log('\t>>dnaInt in 5', Number(dnaInt).toString(5));
	var dna = Number(dnaInt).toString(4).
		replace(/0/g, 'A').
		replace(/1/g, 'C').
		replace(/2/g, 'G').
		replace(/3/g, 'T');

	while (dna.length < len) {
		dna = 'A' + dna;
	}
	// console.log('\t>>dna', dna);
	return dna;
}

function toInt(dna) {
	len = dna.length;

	// console.log('\t>>dnaInt', dna);
	var intt = parseInt(dna.
		replace(/A/g, '0').
		replace(/C/g, '1').
		replace(/G/g, '2').
		replace(/T/g, '3'), 4);

	// console.log('\t>>int in 4', Number(intt).toString(4));
	// console.log('\t>>int', intt);
	return intt;
}