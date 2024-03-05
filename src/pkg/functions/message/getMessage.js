const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function getMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("getMessage", ["string:non-op", "string:non-op", "string:op"], args, false, message);

	if (!error) {
		const channel = await client.channels.cache.get(args[0]);

		if (!channel) {
			await message.channel.send("`$getMessage` invalid channel id.");
			error = true;
		} else {
			try {
				const channelMessage = await channel.messages.fetch(args[1]);

				if (!channelMessage) {
					await message.channel.send("`$getMessage` invalid message id.");
					error = true;
				} else {
					const returnType = args[2] || "content";
					const getter = {
						"content": channelMessage.content,
						"authorID": channelMessage.author.id,
						"username": channelMessage.author.username,
						"avatar": `https://cdn.discordapp.com/avatars/${channelMessage.author.id}/${channelMessage.author.avatar}.png?size=256`
					};

					code = await FunctionResult(code, raw, getter[returnType]);
				}
			} catch (err) {
				await message.channel.send(`\`$getMessage\` error: **${err}**.`);
				error = true;
			}
		}
	}
	return { code, error, options };
}

module.exports = getMessage;