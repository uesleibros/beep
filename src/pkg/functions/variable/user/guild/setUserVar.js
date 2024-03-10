const FunctionError = require("../../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../../helpers/parseArgs.js");
const parseType = require("../../../../helpers/parseType.js");

async function setUserVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("setUserVar", ["string:non-op", "string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[2] || message.author.id).catch(() => null);
		if (!user) {
			await message.channel.send("`setUserVar` invalid user id");
			error = true;
		} else {
			await client.database.setUserGuildVar(args[0], args[1], message.guildId, user.id);
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setUserVar;