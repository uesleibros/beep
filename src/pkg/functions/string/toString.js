const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function toString(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("toString", ["string:non-op", "number:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const value = parseType(args[0]);
		let res;

		try {
			res = args[1] ? value.toString(Number(args[1])) : value.toString();
		} catch (_) {
			await CustomFunctionError("toString", args, 1, message, code, raw, `Radix must be between 2 and 36 but provided "${args[1]}".`);
			error = true;
		}

		code = await FunctionResult(code, raw, res);
	}
	return { code, error, options };
}

module.exports = toString;