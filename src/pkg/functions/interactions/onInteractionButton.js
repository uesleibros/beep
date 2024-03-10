const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function onInteractionButton(code, client, message, raw, options) {
	const args = getFunctionArgs(raw)
	const error = await FunctionError("onInteractionButton", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		options.interactionButtonHandler = args[0];
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = onInteractionButton;