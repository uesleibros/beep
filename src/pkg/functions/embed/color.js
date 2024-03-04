const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function color(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$color` needs 1 argument.");
		error = true;
	} else {
		options.embed.setColor(args[0]);
		code = code.replace(raw, '');
	}

	return { code, error, options };
}

module.exports = color;