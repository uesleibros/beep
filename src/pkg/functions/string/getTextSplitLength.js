const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function getTextSplitLength(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length > 0) {
		await message.channel.send("✖ | Function `$getTextSplitLength` can't have arguments.");
		error = true;
	} else {
		code = code.replace(raw, options.string.textSplit.length);
	}
	return { code, error, options };
}

module.exports = getTextSplitLength;