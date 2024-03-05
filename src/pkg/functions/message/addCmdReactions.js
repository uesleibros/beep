const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const Emoji = require("../../helpers/parser/Emoji.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function addCmdReactions(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("addCmdReactions", ["string:unlimited"], args, false, message);

	if (!error) {
		for (const reaction of args) {
			const emoji = await Emoji(client, reaction)

			if (emoji)
				message.react(emoji);
		}
	}
	code = await FunctionResult(code, raw, '');
	return { code, error, options };
};

module.exports = addCmdReactions;