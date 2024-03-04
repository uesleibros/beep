function parseType(content) {
	switch (content) {
		case "true":
		case "yes":
			return true;
		case "false":
		case "no":
			return false;
	}

	if (!isNaN(content)) {
		return Number(content);
	}
	return content;
}

module.exports = parseType;