const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const CheckCondition = require("../../helpers/CheckCondition.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function iif(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("iif", ["string:non-op", "string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (args.length < 3) {
		const result = eval(CheckCondition.solve(args[0]))?.toString();

		if (!["true", "false"].includes(result)) {
			await message.channel.send(`\`$iif\` is invalid, check conditional: ${args[0]}.`);
			error = true;
		}
		code = await FunctionResult(code, raw, result === "true" ? args[1] : args[2]);
	}

	return { code, error, options };
}

module.exports = iif;