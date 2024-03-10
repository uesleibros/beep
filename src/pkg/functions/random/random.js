const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function random(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("random", ["number:non-op", "number:non-op"], args, true, options.originalCode, raw, message);

	if (!error) {
		const minCeiled = Math.ceil(Number(args[0] ? args[0] : 0));
		const maxFloored = Math.floor(Number(args[1] ? args[1] : 10) + 1);
		code = await FunctionResult(code, raw, Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled));
	}
	return { code, error, options };
}

module.exports = random;