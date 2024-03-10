const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const CheckCondition = require("../../helpers/CheckCondition.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function checkCondition(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("checkCondition", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const conditional = args.join('');
		const result = eval(CheckCondition.solve(conditional))?.toString();

		if (!["true", "false"].includes(result)) {
			await message.channel.send(`\`$checkCondition\` is invalid, check conditional: ${conditional}.`);
			error = true;
		}
		code = await FunctionResult(code, raw, result);
	}

	return { code, error, options };
}

module.exports = checkCondition;