var permutations = [];

function permutate(incomplete, left) {
	if (!left) {
		permutations.push(incomplete);
	} else {
		permutate(incomplete + '0', left - 1);
		permutate(incomplete + '1', left - 1);
	}
}

permutate('', 25);

var count = 0;

for (var i = 0; i < permutations.length; i++) {
	if (permutations[i].indexOf('01') !== -1) {
		count++;
	}
}

console.log(count / permutations.length);