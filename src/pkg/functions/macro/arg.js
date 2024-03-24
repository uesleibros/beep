const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const InterpreterBasic = require("../../helpers/interpreters/InterpreterBasic.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function arg(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("arg", ["number:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const results = await InterpreterBasic(client, message, options.macro.arguments[Number(args[0]) - 1], options);
		code = await FunctionResult(code, raw, results[0]);
	}

	return { code, error, options };
};

module.exports = arg;