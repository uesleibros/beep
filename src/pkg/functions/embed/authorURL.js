const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function authorURL(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("authorURL", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if ("author" in options.embed.data)
			options.embed.data.author.url = args[0];
		code = FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = authorURL;