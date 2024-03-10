const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function jsonPretty(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonPretty", ["number-non:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await message.channel.send("`$jsonPretty` unable to work, try define a json using: `$jsonParse[...]`.");
			error = true;
		} else {
			code = await FunctionResult(code, raw, JSON.stringify(options.json.object, null, Number(args[0])));
		}
	}

	return { code, error, options };
};

module.exports = jsonPretty;