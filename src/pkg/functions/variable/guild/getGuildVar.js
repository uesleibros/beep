const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function getGuildVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("getGuildVar", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const guild = await client.guilds.cache.get(args[1]);
		if (!guild) {
			await message.channel.send("`$getGuildVar` invalid guild id.");
			error = true;
		} else {
			const res = await client.database.getGuildVar(args[0], args[1]);
			if (!res) {
				await message.channel.send("`$getGuildVar` Failed to find variable named '" + args[0] + "'");
				error = true;
			} else {
				code = await FunctionResult(code, raw, res);
			}
		}
	}

	return { code, error, options };
}

module.exports = getGuildVar;