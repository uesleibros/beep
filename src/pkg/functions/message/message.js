const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function message(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("message", ["number:op"], args, true, options.originalCode, raw, message);

	if (!error) {
		let index = args[0] ? Number(args[0]) - 1 : -1;
		code = await FunctionResult(code, raw, index < 0 ? message.content : message.content.split(' ')[index]);
	}
	return { code, error, options };
}

module.exports = message;