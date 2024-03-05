const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function removeSplitTextElement(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("removeSplitTextElement", ["number:non-op"], args, false, message);

	if (!error) {
		if (options.string.textSplit.length > 0 && Number(args[0]) - 1 < options.string.textSplit.length)
			options.string.textSplit.splice(Number(args[0]) - 1, 1);
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = removeSplitTextElement;