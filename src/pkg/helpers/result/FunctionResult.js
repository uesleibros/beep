const truncate = require("../truncate.js");

async function FunctionResult(code, raw, result) {
	if (!code)
		code = ''
	return truncate(code.replaceAll("\\", '').replace(raw.replaceAll("\\", ''), result)).trim();
}

module.exports = FunctionResult;