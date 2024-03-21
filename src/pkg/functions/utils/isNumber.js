const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function isNumber(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("isNumber", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, !isNaN(args[0]));

	return { code, error, options };
};

module.exports = isNumber;