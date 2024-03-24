const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function getTimestamp(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("getTimestamp", ["string:op"], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, Date.now());

	return { code, error, options };
};

module.exports = getTimestamp;