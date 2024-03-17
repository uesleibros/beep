const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function roleCount(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("roleCount", [], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, message.guild.roles.cache.size);

	return { code, error, options };
};

module.exports = roleCount;