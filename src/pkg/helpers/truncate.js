function truncate(text) {
	text = text.split("\n").map(line => line.trim()).join("\n");
	text = text.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
	return text;
};

module.exports = truncate;