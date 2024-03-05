const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function addTimestamp(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("addTimestamp", [], args, true, message);

	if (!error) {
		options.embed.setTimestamp();
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = addTimestamp;