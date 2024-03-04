const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function message(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length == 1) {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$message` first argument needs to be a number.");
			error = true;
		} else {
			code = code.replace(raw, message.content.split(" ")[args[0] - 1]);
		}
	} else if (args.length > 1) {
		await message.channel.send(`✖ | Function \`$message\` only support 1 argument, you passed \`${args.length}\`.`);
		error = true;
	} else {
		code = code.replace(raw, message.content);
	}
	return { code, error, options };
};

module.exports = message;