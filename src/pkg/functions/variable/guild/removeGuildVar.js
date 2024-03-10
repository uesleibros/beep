const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function removeGuildVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("removeGuildVar", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const guild = await client.guilds.cache.get(args[1]);
		if (!guild) {
			await message.channel.send("`$removeGuildVar` invalid guild id.");
			error = true;
		} else {
			await client.database.removeGuildVar(args[0], args[1]);
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = removeGuildVar;