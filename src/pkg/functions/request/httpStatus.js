const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function httpStatus(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("httpStatus", ["boolean:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let statusOnText = args[0] ? parseType(args[0]) === true : false;
		code = await FunctionResult(code, raw, statusOnText ? options.request.object?.statusText : options.request.object?.status);
	}

	return { code, error, options };
};

module.exports = httpStatus;