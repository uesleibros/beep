const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function onReaction(code, client, message, raw, options) {
	const args = getFunctionArgs(raw)
	const error = await FunctionError("onReaction", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		options.reactionHandler = args[0];
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = onReaction;