const FunctionError = require("../../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../../helpers/result/FunctionResult.js");
const CustomFunctionError = require("../../../../helpers/errors/CustomFunctionError.js");
const getFunctionArgs = require("../../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../../helpers/parseArgs.js");
const parseType = require("../../../../helpers/parseType.js");

async function getGuildUserVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("getGuildUserVar", ["string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[1] || message.author.id).catch(() => null);
		if (!user) {
			await CustomFunctionError("getGuildUserVar", args, 1, message, code, raw, `Invalid user id: "${args[1]}".`);
			error = true;
		} else {
			const res = await client.database.getTableValue("userGuildTable", { variableName: args[0], guildId: message.guildId, id: user.id });
			if (!res) {
				await CustomFunctionError("getGuildUserVar", args, 0, message, code, raw, `Variable "${args[0]}" is not declared.`);
				error = true;
			} else {
				code = await FunctionResult(code, raw, res);
			}
		}
	}

	return { code, error, options };
}

module.exports = getGuildUserVar;