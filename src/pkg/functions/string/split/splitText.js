const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");

async function splitText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("splitText", ["number:non-op"], args, false, message);

	if (!error)
		code = await FunctionResult(code, raw, options.string.textSplit[Number(args[0]) - 1]);

	return { code, error, options };
}

module.exports = splitText;