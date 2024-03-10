const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");

async function textSplit(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("textSplit", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		options.string.textSplit = args[0].split(args[1]);
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = textSplit;