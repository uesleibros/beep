const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function random(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length === 0) {
		code = code.replace(raw, Math.floor(Math.random() * 11));
	} else {
		if (args.length < 2) {
			await message.channel.send("✖ | Function `$random` needs to provide min and max.");
			error = true;
		} else {
			if (isNaN(args[0]) && isNaN(args[1])){
				await message.channel.send("✖ | Function `$random` min and max needs to be a number.");
				error = true;
			} else {
				const minCeiled = Math.ceil(Number(args[0]));
				const maxFloored = Math.floor(Number(args[1]) + 1);
				code = code.replace(raw, Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled));
			}
		}
	}
	return { code, error, options };
};

module.exports = random;