const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function authorIcon(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("authorIcon", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if ("author" in options.embed.data)
			options.embed.data.author.icon_url = args[0];
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = authorIcon;