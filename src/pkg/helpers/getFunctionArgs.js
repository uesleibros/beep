function getFunctionArgs(function_raw) {
	const result = [];
	let bracketDepth = 0;
	let currentContent = '';
	let isEscaped = false;

	for (let i = 0; i < function_raw.length; i++) {
		const char = function_raw[i];

		if (char === '[') {
			if (bracketDepth > 0) {
				currentContent += char;
			}
			bracketDepth++;
		} else if (char === ']') {
			bracketDepth--;
			if (bracketDepth === 0) {
				result.push(currentContent.replace(/<@&?(\d+)>/g, (match, id) => id));
				currentContent = '';
			} else {
				currentContent += char;
			}
		} else if (char === ';' && bracketDepth === 1 && !isEscaped) {
			result.push(currentContent.replace(/<@&?(\d+)>/g, (match, id) => id));
			currentContent = '';
		} else if (char === "\\" && !isEscaped) {
			isEscaped = true;
		} else if (bracketDepth > 0) {
			currentContent += char;
			isEscaped = false;
		}
	}

	return result;
};

module.exports = getFunctionArgs;