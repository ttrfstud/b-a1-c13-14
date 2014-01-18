var str = process.argv[2];
var k = process.argv[3];
var t = process.argv[4];
var freqs = {};
var kmers = [];

for (var i = 0; i < str.length - k; i++) {
	var kmer = str.substring(i).substring(0, k);
	if (!(kmers.indexOf(kmer) + 1)) {
		kmers.push(kmer);
		freqs[kmer] = 1;
	} else {
		freqs[kmer]++;
	}
}

kmers = [];
for(key in freqs) if (freqs.hasOwnProperty(key)) {
	if (freqs[key] >= t) {
		kmers.push(key);
	}
}

console.log(kmers.join(' '));
