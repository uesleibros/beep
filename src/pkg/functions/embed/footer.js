const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function footer(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("footer", ["string:non-op"], args, false, message);

	if (!error) {
		options.embed.setFooter({ text: args[0] });
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = footer;