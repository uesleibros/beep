function FunctionLexer(function_raw) {
	const result = [];
	let bracketDepth = 0;
	let currentContent = '';
	let isEscaped = false;

	for (let i = 0; i < function_raw.length; i++) {
		const char = function_raw[i];

		if (char === '[') {
			currentContent += char;
			if (!isEscaped)
				bracketDepth++;
		} else if (char === ']') {
			if (!isEscaped)
				bracketDepth--;
			currentContent += char;

			if (bracketDepth === 0 && !isEscaped) {
				result.push(currentContent.trim());
				currentContent = '';
			}
		} else if (char === ';' && bracketDepth === 1 && !isEscaped) {
			currentContent += char;
		} else if (char === "\\") {
			isEscaped = true;
		} else if (bracketDepth > 0) {
			currentContent += char;
			isEscaped = false;
        } else if (char === '$' && !isEscaped) {
        	if (currentContent.length > 1) {
        		result.push(currentContent.trim());
        		currentContent = '';
        	}
            currentContent += char;
		} else {
            if (currentContent.charAt(0) === "$" && !isEscaped) {
            	const regex = /[^a-zA-Z0-9\[\]]/;

            	if (!regex.test(char)) {
    				currentContent += char;
            	} else {
            		result.push(currentContent.trim());
            		currentContent = '';
            	}

            }
		}
	}

	if (currentContent !== '') {
		for (const content of currentContent.split(/\s+/)) {
			result.push(content.trim());
		}
    }

	return result;
};

module.exports = FunctionLexer;