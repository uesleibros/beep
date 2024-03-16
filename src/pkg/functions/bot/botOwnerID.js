const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function botOwnerID(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("botOwnerID", [], args, true, options.originalCode, raw, message);

	if (!error) {
		await client.application.fetch();
		code = await FunctionResult(code, raw, client.application.owner.id);
	}

	return { code, error, options };
};

module.exports = botOwnerID;