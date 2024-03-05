const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function randomText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const texts = [];
	const error = await FunctionError("randomText", ["string:unlimited"], args, false, message);

	if (!error) {
		for (const text of args) {
			texts.push(text);
		}
		const picked = Math.floor(Math.random() * texts.length);
		code = await FunctionResult(code, raw, texts[picked]);
	}
	return { code, error, options };
}

module.exports = randomText;