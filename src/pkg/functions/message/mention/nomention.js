const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function nomention(code, client, message, raw, options) {
	const args = getFunctionArgs(raw)
	const error = await FunctionError("nomention", [], args, true, message);

	if (!error) {
		options.msg.mentionAuthor = false;
		code = FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = nomention;