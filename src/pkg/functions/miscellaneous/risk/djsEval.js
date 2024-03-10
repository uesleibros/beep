const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");
const interpreter = require("../../../interpreter.js");

async function djsEval(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("eval", ["string:non-op", "boolean:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let evaled = eval(args[0]);
		if (!typeof evaled == "string") evaled = require("util").inspect(evaled);
		
		const returnValue = args[1] ? parseType(args[1]) : false;
		error = true;
		code = await FunctionResult(code, raw, returnValue ? evaled : '');
	}

	return { code, error, options };
};

module.exports = djsEval;