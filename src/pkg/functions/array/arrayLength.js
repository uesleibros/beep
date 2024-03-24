const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function arrayLength(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("arrayLength", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.array[args[0]]) {
			await CustomFunctionError("arrayLength", args, 0, message, code, raw, `Array "${args[0]}" doesn't exist.`);
			error = true;
		} else {
			code = await FunctionResult(code, raw, options.array[args[0]].length);
		}
	}

	return { code, error, options };
};

module.exports = arrayLength;