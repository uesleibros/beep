const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function lowestRole(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("lowestRole", ["string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await message.guild.members.cache.find((m) => m.id === args[0]) || message.guild;
		const roles = user.roles.cache.toJSON();

		code = await FunctionResult(code, raw, user?.displayName ? roles[roles.length - 2].id : roles[roles.length - 1].id);
	}

	return { code, error, options };
};

module.exports = lowestRole;