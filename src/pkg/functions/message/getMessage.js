const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function getMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 2) {
		await message.channel.send(`✖ | Function \`getMessage\` needs channel id, message id and return type (optional), but only passed \`${args.length}\`.`);
		error = true;
	} else {
		const channel = await client.channels.cache.get(args[0]);
		const channelMessage = await channel.messages.fetch(args[1]);

		if (args.length === 3) {
			switch (args[2]) {
				case "content":
					code = code.replace(raw, channelMessage.content);
				case "authorID":
					code = code.replace(raw, channelMessage.author.id);
				case "username":
					code = code.replace(raw, channelMessage.author.username);
				case "avatar":
					code = code.replace(raw, `https://cdn.discordapp.com/avatars/${channelMessage.author.id}/${channelMessage.author.avatar}.png?size=256`);
			}
		} else {
			code = code.replace(raw, channelMessage.content);
		}
	}
	return { code, error, options };
};

module.exports = getMessage;