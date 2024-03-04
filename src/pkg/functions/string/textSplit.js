const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function textSplit(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 2) {
		await message.channel.send("✖ | Function `$textSplit` needs text and separator.");
		error = true;
	} else {
		options.string.textSplit = args[0].split(args[1]);
		code = code.replace(raw, '');
	}

	return { code, error, options };
}

module.exports = textSplit;