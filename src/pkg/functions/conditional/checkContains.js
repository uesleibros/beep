const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function checkContains(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("checkContains", ["string:non-op", "string:non-op"], args, false, message);
	let phrases = [];
	const text = args[0];

	if (!error) {
		args.splice(0, 1);
		for (const phrase of args) {
			phrases.push(phrase);
		}
		code = await FunctionResult(code, raw, phrases.some(phrase => text.includes(phrase)));
	}
	return { code, error, options };
}

module.exports = checkContains;