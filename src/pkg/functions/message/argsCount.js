const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function argsCount(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	let error = false;

	if (args.length > 0) {
		await message.channel.send(`✖ | Function \`$charCount\` can't have arguments.`);
		error = true;
	} else {
		code = code.replace(raw, message.content.length === 0 ? 0 : message.content.split(' ').length);
	}
	return { code, error, options };
};

module.exports = argsCount;