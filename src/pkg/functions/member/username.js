const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function username(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	let error = false;

	if (args.length > 0) {
		await message.channel.send("✖ | Function `$username` can't have arguments.");
		error = true;
	} else {
		code = code.replace(raw, message.author.username);
	}
	return { code, error, options };
};

module.exports = username;