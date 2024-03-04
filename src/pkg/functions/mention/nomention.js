const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function nomention(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length > 0) {
		await message.channel.send("✖ | Function `$nomention` can't have arguments.");
		error = true;
	} else {
		options.msg.mentionAuthor = false;
		code = code.replace(raw, '');
	}

	return { code, error, options };
};

module.exports = nomention;