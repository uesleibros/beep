const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function channelSendMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("channelSendMessage", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const channel = await client.channels.cache.get(args[0]);
		if (channel === undefined) {
			await message.channel.send("`$channelSendMessage` invalid channel id.");
			error = true;
		} else {
			let response = args[1];
			if (options.msg.mentionAuthor)
				response = `<@${message.author.id}> ${args[1]}`;
			await channel.send(response);
			code = await FunctionResult(code, raw, '');
		}
	}
	
	return { code, error, options };
}

module.exports = channelSendMessage;