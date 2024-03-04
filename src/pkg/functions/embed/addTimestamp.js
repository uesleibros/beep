const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function title(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	let error = false;

	if (args.length > 1) {
		await message.channel.send("✖ | Function `$addTimestamp` can't have arguments.");
		error = true;
	} else {
		options.embed.setTimestamp();
		code = code.replace(raw, '');
	}

	return { code, error, options };
}

module.exports = title;