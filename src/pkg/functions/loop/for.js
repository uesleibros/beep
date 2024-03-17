const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const InterpreterBasic = require("../../helpers/interpreters/InterpreterBasic.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function for_func(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("for", ["string:non-op", "number:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const varName = args[0];
		const maxCount = Number(args[1]);
		const forCounts = code.match(/\$for/gi) || [];
		const endforCounts = code.match(/\$endfor/gi) || [];

		if (forCounts.length > endforCounts.length) {
			await CustomFunctionError("for", args, -1, message, code, raw, "Missing `$endfor` keyword.");
			error = true;
		} else {
			options.envVariables[varName] = 0;
			const innerLoopCode = code.substring(code.indexOf(raw) + raw.length + 1, code.lastIndexOf("$endfor"));
			const outerLoopCodeStartIndex = code.indexOf(raw);
			const outerLoopCodeEndIndex = code.lastIndexOf("$endfor");
			const outerLoopCode = code.substring(outerLoopCodeStartIndex, outerLoopCodeEndIndex + "$endfor".length);

			for (let i = 0; i < maxCount; i++) {
				if (options.loop.break)
					break;
				options.envVariables[varName] = i + 1;
				await InterpreterBasic(client, message, innerLoopCode, options);
			}

			delete options.envVariables[varName];
			options.loop.break = false;
			code = await FunctionResult(code, outerLoopCode.trim(), '');
		}
	}
	return { code, error, options, returnHere: true };
}

module.exports = for_func;