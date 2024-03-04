const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function joinSplitText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$joinSplitText` needs 1 argument.");
		error = true;
	} else {
		code = code.replace(raw, options.string.textSplit.join(args[0]));
	}

	return { code, error, options };
}

module.exports = joinSplitText;