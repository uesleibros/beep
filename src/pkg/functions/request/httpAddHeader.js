const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function httpAddHeader(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("httpAddHeader", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		options.request.headers[args[0]] = args[1];
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = httpAddHeader;