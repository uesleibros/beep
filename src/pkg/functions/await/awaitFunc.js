const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function awaitFunc(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("awaitFunc", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!(args[0] in client.commands)) {
			await CustomFunctionError("awaitFunc", args, 0, message, code, raw, `Command specified "${args[0]}" doesn't exist.`)
			error = true;
		} else {
			options.awaitedCommandHandler = args[0];
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = awaitFunc;