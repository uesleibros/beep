const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const CheckCondition = require("../../helpers/CheckCondition.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function or(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("or", ["string:unlimited"], args, false, options.originalCode, raw, message);
	let conditions = [];

	if (!error) {
		for (const condition of args) {
			try {
				conditions.push(eval(CheckCondition.solve(condition)));
			} catch (_) {
				conditions.push(CheckCondition.solve(condition));
			}
			
			if (!["true", "false"].includes(conditions[conditions.length - 1]?.toString())) {
				await CustomFunctionError("or", args, -1, message, code, raw, `Invalid check conditional: **${condition}**.`);
				error = true;
			}
		}
		code = await FunctionResult(code, raw, conditions.some(condition => condition === true));
	}

	return { code, error, options };
}

module.exports = or;