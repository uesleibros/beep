const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function highestRole(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("highestRole", ["string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await message.guild.members.cache.find((m) => m.id === args[0]) || message.guild;
		code = await FunctionResult(code, raw, user?.roles.highest.id);
	}

	return { code, error, options };
};

module.exports = highestRole;