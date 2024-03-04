const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function divide(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 2) {
		await message.channel.send("✖ | Function `$divide` needs 2 arguments.");
		error = true;
	} else {
		if (isNaN(args[1])) {
			await message.channel.send("✖ | Function `$divide` second argument needs to be a number.");
			error = true;
		} else if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$divide` first argument needs to be a number.");
			error = true;
		} else {
			code = code.replace(raw, Number(args[0]) / Number(args[1]));
		}
	}
	return { code, error, options };
};

module.exports = divide;