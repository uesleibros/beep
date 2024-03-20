const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const CheckCondition = require("../../helpers/CheckCondition.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function onlyIf(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("onlyIf", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);
	let result;

	if (!error) {
		try {
			result = eval(CheckCondition.solve(args[0]))?.toString();
		} catch (_) {
			result = CheckCondition.solve(args[0])?.toString();
		}

		if (!["true", "false"].includes(result)) {
			await CustomFunctionError("onlyIf", args, 0, message, code, raw, `Invalid check conditional: **${args[0]}**.`);
			error = true;
		}

		if (result === "false") {
			await message.channel.send(args[1]);
			error = true;
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = onlyIf;