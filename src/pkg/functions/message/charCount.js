const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function charCount(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length == 1) {
		code = code.replace(raw, args[0].length);
	} else if (args.length > 1) {
		await message.channel.send(`✖ | Function \`$charCount\` only support 1 argument, you passed \`${args.length}\`.`);
		error = true;
	}
	return { code, error, options };
};

module.exports = charCount;