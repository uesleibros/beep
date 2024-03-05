const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function sendMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("sendMessage", ["string:non-op", "boolean:op"], args, false, message);

	if (!error) {
		const id = await message.channel.send(args[0]);
		const retrieveID = args[1] ? parseType(args[1]) : false;

		code = await FunctionResult(code, raw, retrieveID ? id.id : '')
	}
	return { code, error, options };
}

module.exports = sendMessage;