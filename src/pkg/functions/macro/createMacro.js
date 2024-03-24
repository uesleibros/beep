const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function createMacro(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options, true);
	const error = await FunctionError("createMacro", ["string:non-op", "boolean:non-op", "array:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		client.createMacro(args[0], parseType(args[1]), JSON.parse(args[2]), args[3]);
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = createMacro;