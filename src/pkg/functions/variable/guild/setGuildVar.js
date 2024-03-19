const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function setGuildVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("setGuildVar", ["string:non-op", "string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const guild = await client.guilds.fetch(args[1] || message.guildId).catch(() => null);
		if (!guild) {
			await CustomFunctionError("getGuildVar", args, 2, message, code, raw, `Provided invalid guild id: "${args[2]}". Check if bot is on this guild.`);
			error = true;
		} else {
			await client.database.setTableValue("guildTable", { value: args[1], variableName: args[0], guildId: guild.id });
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setGuildVar;