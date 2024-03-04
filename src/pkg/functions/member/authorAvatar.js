const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function authorAvatar(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	let error = false;

	if (args.length > 0) {
		await message.channel.send("✖ | Function `$authorAvatar` can't have arguments.");
		error = true;
	} else {
		code = code.replace(raw, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=256`);
	}
	return { code, error, options };
};

module.exports = authorAvatar;