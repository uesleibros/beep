const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function min(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("min", ["number:unlimited"], args, false, message);
	const numbers = [];

	if (!error) {
		for (const number of args) {
			numbers.push(Number(number));
		}
		code = await FunctionResult(code, raw, Math.min(...numbers));
	}

	return { code, error, options };
};

module.exports = min;