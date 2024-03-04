const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function title(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$title` needs 1 argument.");
		error = true;
	} else {
		options.embed.setTitle(args[0]);
		code = code.replace(raw, '');
	}

	return { code, error, options };
}

module.exports = title;