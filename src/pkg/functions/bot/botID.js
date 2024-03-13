const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function botID(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("botID", [], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, client.user.id);

	return { code, error, options };
};

module.exports = botID;