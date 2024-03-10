const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const CheckCondition = require("../../helpers/CheckCondition.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function and(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("and", ["string:unlimited"], args, false, options.originalCode, raw, message);
	let conditions = [];

	if (!error) {
		for (const condition of args) {
			conditions.push(eval(CheckCondition.solve(condition)));
			if (!["true", "false"].includes(conditions[conditions.length - 1].toString())) {
				await message.channel.send(`\`$and\` is invalid, check conditional: ${condition}.`);
				error = true;
			}
		}
		code = await FunctionResult(code, raw, conditions.every(condition => condition === true));
	}

	return { code, error, options };
}

module.exports = and;