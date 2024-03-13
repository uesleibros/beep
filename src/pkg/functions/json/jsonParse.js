const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const ResolveJSON = require("../../helpers/parser/json/ResolveJSON");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function jsonParse(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonParse", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		try {
			options.json.object = JSON.parse(args[0]);
		} catch (err) {
			await message.channel.send(`\`$jsonParse\` error: **${err}**`);
			error = true;
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = jsonParse;