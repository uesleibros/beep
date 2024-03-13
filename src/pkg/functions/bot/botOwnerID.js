const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function botOwnerID(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("botOwnerID", [], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, client.application.owner);

	return { code, error, options };
};

module.exports = botOwnerID;