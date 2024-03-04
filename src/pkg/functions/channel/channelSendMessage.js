const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function channelSendMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 2) {
		await message.channel.send("✖ | Function `$channelSendMessage` needs 2 argument, channel id and text.");
		error = true;
	} else {
		const channel = await client.channels.cache.get(args[0]);
		if (channel === undefined) {
			await message.channel.send("✖ | `$channelSendMessage` invalid channel id.");
			error = true;
		} else {
			await channel.send(args[1]);
			code = code.replace(raw, '');
		}
	}
	return { code, error, options };
};

module.exports = channelSendMessage;