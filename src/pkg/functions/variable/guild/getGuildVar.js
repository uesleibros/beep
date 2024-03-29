const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function getGuildVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("getGuildVar", ["string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const guild = await client.guilds.fetch(args[1] || message.guildId).catch(() => null);
		if (!guild) {
			await CustomFunctionError("getGuildVar", args, 1, message, code, raw, `Provided invalid guild id: "${args[1]}". Check if bot is on this guild.`);
			error = true;
		} else {
			const res = await client.database.getTableValue("guildTable", { variableName: args[0], guildId: guild.id });
			if (!res) {
				await CustomFunctionError("getGuildVar", args, 0, message, code, raw, `Variable "${args[0]}" not defined.`);
				error = true;
			} else {
				code = await FunctionResult(code, raw, res);
			}
		}
	}

	return { code, error, options };
}

module.exports = getGuildVar;