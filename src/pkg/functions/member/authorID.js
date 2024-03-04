const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function authorID(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	let error = false;

	if (args.length > 0) {
		await message.channel.send("✖ | Function `$authorID` can't have arguments.");
		error = true;
	} else {
		code = code.replace(raw, message.author.id);
	}
	return { code, error, options };
};

module.exports = authorID;