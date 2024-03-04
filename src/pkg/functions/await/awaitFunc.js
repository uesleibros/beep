const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function awaitFunc(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("awaitFunc", ["string:non-op"], args, false, message);

	if (!error) {
		if (!(args[0] in client.commands)) {
			await message.channel.send(`\`$awaitFunc\` command: "${args[0]}" not found.`);
			error = true;
		} else {
			client.listAwaitedCommands.push(["awaitFunc", args[0], message.author.id]);
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
};

module.exports = awaitFunc;