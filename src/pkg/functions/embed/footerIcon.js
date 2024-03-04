const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function footerIcon(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("footerIcon", ["string:non-op"], args, false, message);

	if (!error) {
		if ("footer" in options.embed.data)
			options.embed.data.footer.icon_url = args[0];
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = footerIcon;