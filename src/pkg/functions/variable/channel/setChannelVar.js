const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function setChannelVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("setChannelVar", ["string:non-op", "string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const channel = await client.channels.cache.get(args[2]);
		if (!channel) {
			await message.channel.send("`$setChannelVar` invalid channel id.");
			error = true;
		} else {
			await client.database.setChannelVar(args[0], args[1], args[2]);
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setChannelVar;