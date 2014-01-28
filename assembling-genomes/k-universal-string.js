var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e,d) {
	d = d.replace(/\r/g, '').split('\n');

	var k = parseInt(d);

	console.log(k, 'k');

	var graph = makeGraph(k);

	var cycle = [];

	makeCycle(cycle, 0, graph);

	var edge;
	while(typeof(edge = findUnvisited(graph)) !== 'undefined') {
		cycle = remake(cycle, edge);
		makeCycle(cycle, edge, graph);
	}

	console.log(JSON.stringify(cycle));

	cycle = present(cycle, k);
	write('out', cycle);
});

function present(cycle, k) {
	var presentation = '';

	console.log('presentation before', presentation);
	for (var i = 0; i < cycle.length; i++) {
		var str = pad(Number(cycle[i]).toString(2), k - 1);
		presentation += str.split('').shift();
		// console.log('presentation in', presentation);

	}

	return presentation;
}

function makeGraph(k) {
	var power = Math.pow(2, k);
	var graph = [];

	for (var i = 0; i < power; i++) {
		var binary = Number(i).toString(2);

		binary = pad(binary, k);

		var prefix = binary.substr(0, binary.length - 1);
		var suffix = binary.substr(1);

		// console.log(prefix, '->', suffix);

		var toInt = parseInt(prefix, 2);

		if (!graph[toInt]) {
			graph[toInt] = [];
		}

		graph[toInt].push(parseInt(suffix, 2));
	}

	return graph;
}

function pad(binary, k) {
	// console.log('\t>> binary', binary);
	// console.log('\t>> k', k);
	return new Array(k - binary.length + 1).join(0) + binary;
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
	// console.log('\t>>looking for unvisited edges');
	for (var i = 0; i < graph.length; i++) {
		if (graph[i].length) {
			// console.log('\t>>found i = ', i);
			return i;
		}
	}
}

function makeCycle(cycle, edge, graph) {
	var start = edge;
	var next = edge;

	do  {
		prev = next;
		cycle.push(prev);
		// console.log('prev', prev);
		next = graph[prev][0];
		// console.log('next', next);
		graph[prev].splice(0, 1);
	} while (start !== next);	
}