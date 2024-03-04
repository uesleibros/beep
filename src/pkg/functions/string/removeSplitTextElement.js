const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function removeSplitTextElement(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$removeSplitTextElement` needs to provide a index.");
		error = true;
	} else {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$removeSplitTextElement` first argument needs to be a number.");
			error = true;
		} else {
			if (options.string.textSplit.length > 0 && Number(args[0]) - 1 < options.string.textSplit.length)
				options.string.textSplit.splice(Number(args[0]) - 1, 1);
			code = code.replace(raw, '');
		}
	}

	return { code, error, options };
}

module.exports = removeSplitTextElement;