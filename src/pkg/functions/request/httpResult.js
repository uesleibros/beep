const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function httpResult(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("httpResult", [], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, typeof options.request.object?.data === "object" ? JSON.stringify(options.request.object?.data) : options.request.object?.data);

	return { code, error, options };
};

module.exports = httpResult;