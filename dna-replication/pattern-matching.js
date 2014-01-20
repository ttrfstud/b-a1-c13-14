var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (err, data) {
	var pattern = data.split('\n')[0].trim();
	var text = data.split('\n')[1].trim();

	var regex = new RegExp(pattern, 'gi');

	var result;
	var indices = [];
	while((result = regex.exec(text)) !== null) {
		indices.push(result.index);
		regex.lastIndex = result.index + 1;
	}

	write('out', indices.join(' '));
});