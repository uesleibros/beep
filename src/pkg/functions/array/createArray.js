const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function createArray(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("createArray", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		options.array[args[0]] = args.slice(1);
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = createArray;