var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e,d) {
	d = d.replace(/\r/g, '').split('\n');

	var graph = [];

	for (var i = 0; i < d.length; i++) {
		var line = d[i];

		var from = line.split(' -> ')[0];
		var tos = line.split(' -> ')[1];

		graph[parseInt(from)] = [];

		tos = tos.split(',');

		for (var j = 0; j < tos.length; j++) {
			graph[from].push(parseInt(tos[j]));
		}
	}

	var pair = balance(graph);

	console.log(JSON.stringify(graph));
	// console.log('www', 'hi');

	var cycle = [];

	makeCycle(cycle, 0, graph);

	var edge;
	while(typeof(edge = findUnvisited(graph)) !== 'undefined') {
		cycle = remake(cycle, edge);
		makeCycle(cycle, edge, graph);
	}

	// console.log(JSON.stringify(cycle));

	cycle = breac(cycle, pair);
	write('out', cycle.join('->'));
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
			console.log(i, '@', count[i]);
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
		console.log(prev);
		next = graph[prev][0];
		graph[prev].splice(0, 1);
		// console.log('next', typeof next, 'start', typeof start, '==', start === next);
	} while (start !== next);	

	// console.log('\t>>cycle is afta', JSON.stringify(cycle));
	// console.log('\t>>graph is afta', JSON.stringify(graph));

}