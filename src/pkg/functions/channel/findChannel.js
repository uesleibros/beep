const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function findChannel(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("findChannel", ["string:non-op", "string:op"], args, false, message);;

	if (!error) {
		const channel = await client.channels.cache.get(args[0]);
		if (channel === undefined) {
			await message.channel.send("`$findChannel` invalid channel id.");
			error = true;
		} else {
			code = await FunctionResult(code, raw, channel.id);
		}
	}
	return { code, error, options };
};

module.exports = findChannel;