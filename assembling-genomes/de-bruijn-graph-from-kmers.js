var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e,d) {

	var patterns = d.replace(/\r/g, '').split('\n');

	var graph = {};

	for (var i = 0; i < patterns.length; i++) {
		var suffix = patterns[i].substr(1);
		var prefix = patterns[i].substr(0, patterns[i].length - 1);

		console.log('suf', suffix, 'pref', prefix);
		if (!graph[prefix]) {
			graph[prefix] = [];
		}

		graph[prefix].push(suffix);
	}

	var presentation = [];

	for (var i in graph) if (graph.hasOwnProperty(i)) {
		var str = i + ' -> ';
		var prefix = '';

		for (var j = graph[i].length - 1; j >= 0; j--) {
			str += prefix + graph[i][j];
			prefix = ',';
		}

		presentation.push(str);
	}

	write('out', presentation.join('\n'));
});