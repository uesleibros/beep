const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function charAt(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("charAt", ["string:non-op", "number:non-op"], args, false, code, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, args[0].charAt(Number(args[1]) - 1));
	return { code, error, options };
}

module.exports = charAt;