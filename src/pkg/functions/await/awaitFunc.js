const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function awaitFunc(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$awaitFunc` needs command name.");
		error = true;
	} else {
		if (!(args[0] in client.commands)) {
			await message.channel.send(`✖ | \`$awaitFunc\` command: "${args[0]}" not found.`);
			error = true;
		} else {
			client.listAwaitedCommands.push(["awaitFunc", args[0], message.author.id]);
			code = code.replace(raw, '');
		}
	}

	return { code, error, options };
};

module.exports = awaitFunc;