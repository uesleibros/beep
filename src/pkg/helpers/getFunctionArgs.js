function getFunctionArgs(function_raw) {
	const result = [];
	let bracketDepth = 0;
	let currentContent = '';

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
				result.push(currentContent);
				currentContent = '';
			} else {
				currentContent += char;
			}
		} else if (char === ';' && bracketDepth === 1) {
			result.push(currentContent);
			currentContent = '';
		} else if (bracketDepth > 0) {
			currentContent += char;
		}
	}

	/*for (const idx in result) {
		if (result[idx].length === 0)
			result.slice(idx, 1);
	}*/
	return result;
}

module.exports = getFunctionArgs;