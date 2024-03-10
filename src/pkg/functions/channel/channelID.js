const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function channelID(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("channelID", [], args, true, options.originalCode, raw, message);

	if (!error) {
		code = await FunctionResult(code, raw, message.channel.id);
	}
	
	return { code, error, options };
}

module.exports = channelID;