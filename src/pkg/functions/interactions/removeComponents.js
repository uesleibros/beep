const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function removeComponents(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("removeComponents", [], args, true, options.originalCode, raw, message);

	if (!error) {
		options.interactionComponents = [];
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = removeComponents;