const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function toUpperCase(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("toUpperCase", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, args[0].toUpperCase());
	return { code, error, options };
}

module.exports = toUpperCase;