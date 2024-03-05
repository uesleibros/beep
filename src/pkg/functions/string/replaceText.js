const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

function replaceNtimes(input, searchValue, replaceValue, n) {
	let count = 0;
	return input.replace(new RegExp(searchValue, "g"), match => {
		count++;
		if (n === -1 || count <= n) {
			return replaceValue;
		} else {
			return match;
		}
	});
}

async function replaceText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("replaceText", ["string:non-op", "string:non-op", "string:non-op", "number:op"], args, false, message);

	if (!error) {
		const replaceTimes = args[3] ? Number(args[3]) : 1;
		code = await FunctionResult(code, raw, replaceNtimes(args[0], args[1], args[2], replaceTimes))
	}

	return { code, error, options };
}

module.exports = replaceText;