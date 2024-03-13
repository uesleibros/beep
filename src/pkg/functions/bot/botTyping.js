const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function botTyping(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("botTyping", [], args, true, options.originalCode, raw, message);

	if (!error) {
		await message.channel.sendTyping();
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = botTyping;