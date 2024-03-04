const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function addField(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 2) {
		await message.channel.send("✖ | Function `$addField` needs 2 argument (3 is optional).");
		error = true;
	} else {
		options.embed.addFields({ name: args[0], value: args[1], inline: parseType(args[2]) || false });
		code = code.replace(raw, '');
	}

	return { code, error, options };
}

module.exports = addField;