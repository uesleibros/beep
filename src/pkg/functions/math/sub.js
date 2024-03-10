const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function sub(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("sub", ["number:non-op", "number:non-op"], args, false, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, Number(args[0]) - Number(args[1]));

	return { code, error, options };
}

module.exports = sub;