const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function calculate(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("calculate", ["string:non-op"], args, false, options.originalCode, raw, message);
	console.log(args)

	if (!error) {
		let regex = /^\s*([-+]?)(\d+)(?:\s*([-+.\^*\/])\s*((?:\s[-+])?\d+)\s*)+$/g;

		if (regex.test(args[0])) {
			code = await FunctionResult(code, raw, eval(args[0]));
		} else {
			await message.channel.send("`$calculate` invalid expression.");
			error = true;
		}
	}
	return { code, error, options };
}

module.exports = calculate;