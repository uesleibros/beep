const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function max(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("max", ["number:unlimited"], args, false, message);
	const numbers = [];

	if (!error) {
		for (const number of args) {
			numbers.push(Number(number));
		}
		code = await FunctionResult(code, raw, Math.max(...numbers));
	}

	return { code, error, options };
}

module.exports = max;