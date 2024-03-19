const FunctionError = require("../../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../../helpers/errors/CustomFunctionError.js");
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
			await CustomFunctionError("setUserVar", args, 2, message, code, raw, `Provided invalid user id: "${args[2]}"`);
			error = true;
		} else {
			await client.database.setTableValue("userGuildTable", { value: args[1], variableName: args[0], guildId: message.guildId, id: user.id });
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setUserVar;