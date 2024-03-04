const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function authorAvatar(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("authorAvatar", [], args, true, message);

	if (!error)
		code = await FunctionResult(code, raw, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=256`);
	return { code, error, options };
};

module.exports = authorAvatar;