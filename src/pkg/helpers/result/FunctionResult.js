const truncate = require("../truncate.js");

async function FunctionResult(code, raw, result) {
	return truncate(code.replace(raw, result)).trim();
}

module.exports = FunctionResult;