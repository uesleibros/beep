const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function toLowerCase(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$toLowerCase` needs to provide a text.");
		error = true;
	} else {
		code = code.replace(raw, args[0].toLowerCase());
	}
	return { code, error, options };
};

module.exports = toLowerCase;