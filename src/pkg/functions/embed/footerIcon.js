const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function footerIcon(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$footerIcon` needs 1 argument.");
		error = true;
	} else {
		if ("footer" in options.embed.data)
			options.embed.data.footer.icon_url = args[0];
		code = code.replace(raw, '');
	}

	return { code, error, options };
}

module.exports = footerIcon;