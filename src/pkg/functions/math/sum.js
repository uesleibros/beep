const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function sum(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("sum", ["number:non-op", "number:non-op"], args, false, message);

	if (!error)
		code = await FunctionResult(code, raw, Number(args[0]) + Number(args[1]));

	return { code, error, options };
}

module.exports = sum;