const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function cos(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("cos", ["number:non-op"], args, false, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, Math.cos(Number(args[0])));
	return { code, error, options };
}

module.exports = cos;