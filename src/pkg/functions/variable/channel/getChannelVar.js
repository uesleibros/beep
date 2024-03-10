const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function getChannelVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("getChannelVar", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const channel = await client.channels.cache.get(args[1]);
		if (!channel) {
			await message.channel.send("`$getChannelVar` invalid channel id.");
			error = true;
		} else {
			const res = await client.database.getChannelVar(args[0], args[1]);
			if (!res) {
				await message.channel.send("`$getChannelVar` Failed to find variable named '" + args[0] + "'");
				error = true;
			} else {
				code = await FunctionResult(code, raw, res);
			}
		}
	}

	return { code, error, options };
}

module.exports = getChannelVar;