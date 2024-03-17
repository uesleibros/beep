const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function reply(code, client, message, raw, options) {
	const args = getFunctionArgs(raw)
	const error = await FunctionError("reply", [], args, true, options.originalCode, raw, message);

	if (!error) {
		options.msg.reply = true;
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = reply;