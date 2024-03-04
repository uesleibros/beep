const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function abs(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$abs` needs 1 argument.");
		error = true;
	} else {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$abs` needs to be a number.");
			error = true;
		} else {
			code = code.replace(raw, Math.abs(Number(args[0])));
		}
	}
	return { code, error, options };
};

module.exports = abs;