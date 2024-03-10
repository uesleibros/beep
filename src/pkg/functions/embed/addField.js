const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function addField(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("addField", ["string:non-op", "string:non-op", "boolean:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		options.embed.addFields({ name: args[0], value: args[1], inline: parseType(args[2]) || false });
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
}

module.exports = addField;