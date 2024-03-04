const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function round(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$round` needs to provide a number.");
		error = true;
	} else {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$round` provided value needs to be a number.");
			error = true;
		} else {
			code = code.replace(raw, Math.round(Number(args[0])));
		}
	}
	return { code, error, options };
};

module.exports = round;