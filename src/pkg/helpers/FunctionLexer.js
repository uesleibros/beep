function FunctionLexer(function_raw) {
    const result = [];
    let bracketDepth = 0;
    let currentContent = '';

    for (let i = 0; i < function_raw.length; i++) {
        const char = function_raw[i];

        if (char === '[') {
            bracketDepth++;
            currentContent += char;
        } else if (char === ']') {
            if (bracketDepth > 0) {
                bracketDepth--;
                currentContent += char;
            }
        } else if (char === ";" && bracketDepth === 1) {
            currentContent += char;
        } else if (bracketDepth > 0) {
            currentContent += char;
        } else if (["$", "@"].includes(char)) {
            if (currentContent.length > 1) {
                result.push(currentContent.trim());
                currentContent = '';
            }
            currentContent += char;
        } else if (["$", "@"].includes(currentContent.charAt(0))) {
            const regex = /[^a-zA-Z0-9\[\]]/g;
            if (!regex.test(char)) {
                currentContent += char;
            } else {
                result.push(currentContent.trim());
                currentContent = '';
            }
        } else {
            if (["$", "@"].includes(currentContent.charAt(0))) {
                const regex = /[^a-zA-Z0-9\[\]]/g;
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
        result.push(currentContent.trim());
    }

    return result;
}

module.exports = FunctionLexer;