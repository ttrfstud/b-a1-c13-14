var timeout = 1000;

var id = setInterval(function () {
	console.log(timeout--);

	if (!timeout) {
		clearInterval(id);
	}
}, 1);