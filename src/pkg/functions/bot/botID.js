const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function botID(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("botID", [], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, client.user.id);

	return { code, error, options };
};

module.exports = botID;