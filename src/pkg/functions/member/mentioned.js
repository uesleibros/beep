const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function mentioned(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("mentioned", ["number:non-op"], args, false, message);

	if (!error)
		code = await FunctionResult(code, raw, message.mentions.users.at(Number(args[0]) - 1)?.id);
	return { code, error, options };
}

module.exports = mentioned;