const truncate = require("../truncate.js");

async function FunctionResult(code, raw, result) {
	if (!code)
		code = ''
	return truncate(code.replace(raw, result)).trim();
}

module.exports = FunctionResult;