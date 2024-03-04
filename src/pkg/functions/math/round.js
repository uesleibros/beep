const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function round(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("round", ["number:non-op"], args, false, message);

	if (!error)
		code = await FunctionResult(code, raw, Math.round(Number(args[0])));
	return { code, error, options };
};

module.exports = round;