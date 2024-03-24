const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function arrayIndexOf(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("arrayIndexOf", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.array[args[0]]) {
			await CustomFunctionError("arrayIndexOf", args, 0, message, code, raw, `Array "${args[0]}" doesn't exist.`);
			error = true;
		} else {
			code = await FunctionResult(code, raw, options.array[args[0]].indexOf(args[1]) + 1);
		}
	}

	return { code, error, options };
};

module.exports = arrayIndexOf;