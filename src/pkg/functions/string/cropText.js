const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function cropText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 3) {
		await message.channel.send("✖ | Function `$cropText` needs to provide text, max characters and ending.");
		error = true;
	} else {
		if (isNaN(args[1])) {
			await message.channel.send("✖ | `$cropText` max characters needs to be a number");
			error = true;
		} else {
			code = code.replace(raw, args[0].substring(0, Number(args[1])) + args[2]);
		}
	}

	return { code, error, options };
}

module.exports = cropText;