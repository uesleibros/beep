const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function argsCount(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("argsCount", [], args, true, message);

	if (!error)
		code = await FunctionResult(code, raw, message.content.trim().length === 0 ? 0 : message.content.trim().split(' ').length);
	return { code, error, options };
}

module.exports = argsCount;