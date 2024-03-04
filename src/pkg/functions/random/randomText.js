const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function randomText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const texts = [];
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$randomText` needs atleast one text.");
		error = true;
	} else {
		for (const text of args) {
			texts.push(text);
		}
		const picked = Math.floor(Math.random() * texts.length);
		code = code.replace(raw, texts[picked]);
	}
	return { code, error, options };
};

module.exports = randomText;