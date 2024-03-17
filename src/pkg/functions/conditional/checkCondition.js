const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const CheckCondition = require("../../helpers/CheckCondition.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function checkCondition(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("checkCondition", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		const conditional = args.join('');
		let result;
		try {
			result = eval(CheckCondition.solve(conditional))?.toString();
		} catch (_) {
			result = CheckCondition.solve(conditional)?.toString();
		}

		if (!["true", "false"].includes(result)) {
			await CustomFunctionError("checkCondition", args, -1, message, code, raw, `Invalid check conditional: **${args[0]}**.`);
			error = true;
		}
		code = await FunctionResult(code, raw, result);
	}

	return { code, error, options };
}

module.exports = checkCondition;