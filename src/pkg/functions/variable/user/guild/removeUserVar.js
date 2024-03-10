const FunctionError = require("../../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../../helpers/parseArgs.js");
const parseType = require("../../../../helpers/parseType.js");

async function removeUserVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("removeUserVar", ["string:non-op", "string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[1] || message.author.id).catch(() => null);
		if (!user || !guild) {
			await message.channel.send("`removeUserVar` invalid user id.");
			error = true;
		} else {
			code = await FunctionResult(code, raw, await client.database.removeUserGuildVar(args[0], message.guildId, user.id));
		}
	}

	return { code, error, options };
}

module.exports = removeUserVar;