const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function authorURL(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$authorURL` needs 1 argument.");
		error = true;
	} else {
		if ("author" in options.embed.data)
			options.embed.data.author.url = args[0];
		code = code.replace(raw, '');
	}

	return { code, error, options };
}

module.exports = authorURL;