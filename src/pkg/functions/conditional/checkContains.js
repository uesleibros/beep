const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function checkContains(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let phrases = [];
	let error = false;
	const text = args[0];

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$checkContains` needs text and phrases.");
		error = true;
	} else {
		args.slice(0, 1);
		for (const phrase of args) {
			phrases.push(phrase);
		}
		code = code.replace(raw, phrases.some(phrase => text.includes(phrase)));
	}

	return { code, error, options };
}

module.exports = checkContains;