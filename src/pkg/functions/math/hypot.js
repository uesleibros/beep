const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function hypot(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("hypot", ["number:unlimited"], args, false, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, Math.hypot( ...args ));
	return { code, error, options };
}

module.exports = hypot;