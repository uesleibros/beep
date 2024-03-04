const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function exitfor(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	let error = false;

	if (args.length > 0) {
		await message.channel.send("✖ | Function `$exitfor` can't have arguments.");
		error = true;
	} else {
		options.loop.break = true;
		code = code.replace(raw, '');
	}
	return { code, error, options };
};

module.exports = exitfor;