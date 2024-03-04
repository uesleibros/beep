const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function splitText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$splitText` needs to provide a index.");
		error = true;
	} else {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$splitText` first argument needs to be a number.");
			error = true;
		} else {
			if (options.string.textSplit.length > 0)
				code = code.replace(raw, Number(args[0]) - 1 < options.string.textSplit.length ? options.string.textSplit[Number(args[0]) - 1] : options.string.textSplit[options.string.textSplit.length - 1]);
			else
				code = code.replace(raw, -1);
		}
	}

	return { code, error, options };
}

module.exports = splitText;