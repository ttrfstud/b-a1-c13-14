var read = require('fs').readFile;
var write = require('fs').writeFileSync;

var len;

function pair(k1, k2) {
	this.k1 = k1;
	this.k2 = k2;
}

pair.fromHash = function (hash) {
	if (hash instanceof pair) {
		return hash;
	}

	// console.log('>>from hash', hash);
	var f = parseInt(hash.split('|')[0]);
	var s = parseInt(hash.split('|')[1]);
	// console.log('from hashing', f);
	// console.log('from hashing', s);
	return new pair(f, s);
}

pair.prototype.equals = function (pair1) {
	return this.hash() === pair1.hash();
}

pair.prototype.hash = function () {
	return this.k1 + '|' + this.k2;
}

pair.prototype.toString = function () {
	return '[' + this.hash() + ']';
}

read('data', {encoding: 'utf8'}, function (e,d) {
	d = d.replace(/\r/g, '').split('\n');

	var graph = makeGraph(d.slice(1));
	// console.log('graph?', graph);
	var k = d.slice(1)[0].length - 1;

	d = parseInt(d[0]);

	var pp = balance(graph);

	// console.log('balanced graph?', graph);

	var cycle = [];

	// console.log('graph keys?', Object.keys(graph));

	makeCycle(cycle, pair.fromHash(Object.keys(graph)[0]), graph, k, d);

	// console.log('first iteration of cycle', cycle);

	var edge;
	while(typeof(edge = findUnvisited(graph)) !== 'undefined') {
		cycle = remake(cycle, edge);
		makeCycle(cycle, edge, graph, k, d);
	}

	// console.log(JSON.stringify(cycle));

	cycle = breac(cycle, pp);
 
	// console.log(JSON.stringify(cycle));

	cycle = cycle.map(function (el) { 
		return new pair(fromInt(el.k1), fromInt(el.k2));
	});

	var presentation = cycle[0].k1;

	for (var i = 1; i < cycle.length; i++) {
		presentation += cycle[i].k1.substr(-1);
	}

	for (var i = cycle.length - d - k; i < cycle.length; i++) {
		presentation += cycle[i].k2.substr(-1);
	}

	// console.log('presentation', presentation);

	write('out', presentation);
});

function makeGraph(readPairs) {
	var graph = [];

	// console.log('read pairs', readPairs);

	for (var i = 0; i < readPairs.length; i++) {
		var rp = readPairs[i];

		var f = rp.split('|')[0];
		var s = rp.split('|')[1];

		var fp = f.substring(0, f.length - 1);
		var fs = f.substring(1);

		var sp = s.substring(0, s.length - 1);
		var ss = s.substring(1);

		var prefix = new pair(toInt(fp), toInt(sp));
		var suffix = new pair(toInt(fs), toInt(ss));

		if (!graph[prefix.hash()]) {
			graph[prefix.hash()] = [];
		}

		// console.log('\t>>for', rp);
		// console.log('\t>>prefix', prefix, prefix.hash());
		// console.log('\t>>suffix', suffix, suffix.toString());

		graph[prefix.hash()].push(suffix);
	}

	// console.log('\t>>graph', graph);
	return graph;
}

function breac(cycle, pair) {
	var among = false;

	for (var i = 0; i < cycle.length - 1; i++) {
		if (pair[cycle[i].hash()] && pair[cycle[i + 1].hash()]) {
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
			if (!count[graph[i][j].hash()]) count[graph[i][j].hash()] = 0;

			count[graph[i][j].hash()] += 1;
		}
	}

	var p = [];
	var to, from;
	for (var i in count) {
		if (count[i]) {
			// console.log(i, '@', count[i]);
			if (count[i] < 0) {
				// console.log('to is', i);
				to = pair.fromHash(i);
				// console.log('so to is', to);
				p[i] = -1;
			} else {
				from = i;
				p[i] = 1;
			}
		}
	}

	if (!graph[from]) graph[from] = [];
	graph[from].push(to);
	graph[from].ignorable = [];
	graph[from].ignorable.push(to);

	// console.log('FROM', from);

	if (Object.keys(p).length !== 2) {
		throw new Error(JSON.stringify(p));
	}

	return p;
}

function remake(cycle, edge) {
	var idx;

	for (var i = 0; i < cycle.length; i++) {
		if (cycle[i].equals(edge)) {
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
			return pair.fromHash(i);
		}
	}
}

function makeCycle(cycle, edge, graph, k, d) {
	var start = edge;
	var next = edge;
	// console.log('\t>>cycle is bifo', JSON.stringify(cycle));
	// console.log('\t>>graph is bifo', JSON.stringify(graph));
	do  {
		console.log('next', next);
		prev = next;
		cycle.push(prev);
		console.log('prev', prev);
		next = chooseNext(graph, cycle, prev, k, d);
		// console.log('next', typeof next, 'start', typeof start, '==', start === next);
	} while (!start.equals(next));	

	// console.log('\t>>cycle is afta', JSON.stringify(cycle));
	// console.log('\t>>graph is afta', JSON.stringify(graph));

}

function chooseNext(graph, cycle, prev, k, d) {
	var phash = prev.hash();
	var next;

	if (cycle.length < d + 2) { // k + d - (k - 1) = d + 1
		next = graph[phash][0];
		// console.log('>>@', fromInt(next.k1), '/', fromInt(next.k2));
		graph[phash].splice(0, 1);
	} else {
		var checknode = cycle[cycle.length - d - 2];
		var k2 = checknode.k2;
		k2 = fromInt(k2);
		// console.log('with this one', fromInt(checknode.k1), '/', k2);
		k2 = k2.substr(0, 1);
		for (var i = 0; i < graph[phash].length; i++) {
			var outnode = graph[phash][i];
			var k1o = outnode.k1;
			k1o = fromInt(k1o);
			// console.log('>>@', k1o, '/', fromInt(outnode.k2));

			k1o = k1o.substr(-1);
	
			// console.log('k1o', k1o, 'k2', k2);

			if (k1o === k2 || graph[checknode.hash()].ignorable) {
				next = outnode;
				graph[phash].splice(i, 1);
				break;
			}
		}
	}

	return next;
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