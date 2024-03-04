const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function findChannel(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$findChannel` needs to provide channel id.");
		error = true;
	} else {
		const channel = await client.channels.cache.get(args[0]);
		if (channel === undefined) {
			await message.channel.send("✖ | `$findChannel` invalid channel id.");
			error = true;
		} else {
			if (args.length === 2) {
				switch (args[1]) {
					case "name":
						code = code.replace(raw, channel.name);
						break;
					case "id":
						code = code.replace(raw, channel.id);
						break;
					case "mention":
						code = code.replace(raw, `<#${channel.id}>`);
						break;
					default:
						await message.channel.send("✖ | Function `$findChannel` on 2 argument needs to be: `name`, `id` or `mention`.");
						error = true;
						break;
				}
			} else {
				code = code.replace(raw, channel.id);
			}
		}
	}
	return { code, error, options };
};

module.exports = findChannel;