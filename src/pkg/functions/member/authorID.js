const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function authorID(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("authorID", [], args, true, message);

	if (!error)
		code = await FunctionResult(code, raw, message.author.id);
	return { code, error, options };
};

module.exports = authorID;