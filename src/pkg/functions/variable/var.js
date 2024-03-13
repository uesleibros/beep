const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function var_func(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("var", ["string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (args.length > 1) {
			options.variables[args[0]] = args[1];
			code = await FunctionResult(code, raw, '');
		} else {
			if (!(args[0] in options.variables))
				code = await FunctionResult(code, raw, "undefined");
			else
				code = await FunctionResult(code, raw, options.variables[args[0]]);
		}
	}

	return { code, error, options };
}

module.exports = var_func;