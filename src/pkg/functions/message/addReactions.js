const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function addReactions(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$addReactions` needs atleast 1 argument.");
		error = true;
	} else {
		for (const reaction of args) {
			message.react(reaction);
		}
	}
	code = code.replace(raw, '');
	return { code, error, options };
};

module.exports = addReactions;