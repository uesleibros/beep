const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function randomChannelID(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("randomChannelID", [], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, message.guild.channels.cache.filter((c) => c.type !== 4).random().id);
	return { code, error, options };
}

module.exports = randomChannelID;