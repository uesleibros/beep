const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const truncate = require("../../helpers/truncate.js");

async function noMentionMessage(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const customMessage = truncate(message.content.replace(/<@[^>]+>/g, ''));
	const error = await FunctionError("noMentionMessage", ["number:op"], args, true, message);

	if (!error) {
		let index = args[0] ? Number(args[0]) - 1 : -1;
		code = await FunctionResult(code, raw, index < 0 ? customMessage : customMessage.split(' ')[index]);
	}
	return { code, error, options };
};

module.exports = noMentionMessage;