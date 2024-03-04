const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const truncate = require("../../helpers/truncate.js");

async function noMentionMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const customMessage = truncate(message.content.replace(/<@[^>]+>/g, ''));
	let error = false;

	if (args.length > 0) {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$noMentionMessage` first argument needs to be a number.");
			error = true;
		} else {
			if (Number(args[0]) - 1 > customMessage.split(" ").length) {
				code = code.replace(raw, undefined);
			} else {
				code = code.replace(raw, customMessage.split(" ")[Number(args[0]) - 1]);
			}
		}
	} else {
		if (args.length > 1) {
			await message.channel.send("✖ | `$noMentionMessage` only support 1 argument.");
			error = true;
		} else {
			code = code.replace(raw, customMessage);
		}
	}
	return { code, error, options };
};

module.exports = noMentionMessage;