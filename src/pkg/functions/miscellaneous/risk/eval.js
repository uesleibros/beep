const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const truncate = require("../../../helpers/truncate.js");
const interpreter = require("../../../interpreter.js");

async function eval_func(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("eval", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		await interpreter(client, message, truncate(args[0].trim()), options);
		error = true;
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = eval_func;