var read = require('fs').readFile;
var write = require('fs').writeFileSync;

read('data', {encoding: 'utf8'}, function (e, d) {
	write('data', d.replace(/\r/g, '').split('\n').join(''));
});