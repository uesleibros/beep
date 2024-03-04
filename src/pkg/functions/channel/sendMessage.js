const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function sendMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$sendMessage` needs 1 argument, text (second argument is optional (if want to return id of message)).");
		error = true;
	} else {
		const id = await message.channel.send(args[0]);
		const retrieveID = args[1] ? parseType(args[1]) : false;

		code = code.replace(raw, retrieveID ? id.id : '');
	}
	return { code, error, options };
};

module.exports = sendMessage;