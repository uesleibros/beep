const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function mentioned(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$mentioned` needs to provide a index.");
		error = true;
	} else {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | `$mentioned` provided value needs to be a number.");
			error = true;
		} else {
			code = code.replace(raw, message.mentions.users.at(Number(args[0] - 1))?.id);
		}
	}

	return { code, error, options };
};

module.exports = mentioned;