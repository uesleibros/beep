function truncate(text) {
	let result = '';

	for (const value of text.split("\n")) {
		if (value.length > 0)
			result += value.trim() + "\n";
	}
	return result.trim();
}

module.exports = truncate;