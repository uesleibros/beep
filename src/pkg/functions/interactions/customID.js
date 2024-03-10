const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function customID(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("customID", [], args, true, options.originalCode, raw, message);

	if (!error) {
		code = await FunctionResult(code, raw, message?.customId);
	}

	return { code, error, options };
};

module.exports = customID;