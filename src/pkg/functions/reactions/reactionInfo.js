const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function reactionInfo(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("reactionInfo", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const getter = {
			"count": message?.count,
			"emoji": message?.emoji?.name,
			"animated": message?.emoji?.animated,
			"id": message?.emoji?.id
		}
		code = await FunctionResult(code, raw, getter[args[0]]);
	}

	return { code, error, options };
};

module.exports = reactionInfo;