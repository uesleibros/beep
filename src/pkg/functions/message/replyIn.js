const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

function parseReplyInArgument(timeString) {
	const regex = /^(\d+)([smh]|(ms))$/;
	const matches = timeString.match(regex);

	if (!matches)
		return null;

	const value = parseInt(matches[1]);
	const unit = matches[2];

	switch (unit) {
		case 's':
			return value * 1000;
		case 'm':
			return value * 60 * 1000;
		case 'h':
			return value * (60 * 60) * 1000;
		case 'ms':
			return value;
		default:
			return null;
	}
}

async function replyIn(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("replyIn", ["string:non-op"], args, true, options.originalCode, raw, message);

	if (!error) {
		const replyTime = parseReplyInArgument(args[0]);
		options.msg.reply = true;

		if (replyTime) {
			options.msg.replyIn = replyTime;
		} else {
			await CustomFunctionError("replyIn", args, 0, message, code, raw, "Invalid reply time format, should be: `x(ms,s,m,h)`.");
			error = true;
		}
		
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = replyIn;