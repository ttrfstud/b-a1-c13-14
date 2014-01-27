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

	var cycle = [];

	makeCycle(cycle, 0, graph);

	var edge;
	while(typeof(edge = findUnvisited(graph)) !== 'undefined') {
		cycle = remake(cycle, edge);
		makeCycle(cycle, edge, graph);
	}

	console.log(JSON.stringify(cycle));
	cycle.push(cycle[0]);
	write('out', cycle.join('->'));
});

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