const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function exitfor(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("exitfor", [], args, true, options.originalCode, raw, message);

	if (!error) {
		options.loop.break = true;
		code = await FunctionResult(code, raw, '');
	}
	return { code, error, options };
}

module.exports = exitfor;