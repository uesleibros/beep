const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function argsCheck(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const messageArgsLength = message.content.trim().length === 0 ? 0 : message.content.trim().split(' ').length;
	let error = await FunctionError("argsCheck", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const regex = /<=|>=|<|>|!=|==/g;
		const checks = {
			'<': messageArgsLength < Number(args[0].replace('<', '').trim()),
			'>': messageArgsLength > Number(args[0].replace('>', '').trim()),
			"<=": messageArgsLength <= Number(args[0].replace("<=", '').trim()),
			">=": messageArgsLength >= Number(args[0].replace(">=", '').trim()),
			"==": messageArgsLength == Number(args[0].replace("==", '').trim()),
			"!=": messageArgsLength !== Number(args[0].replace("!=", '').trim())
		}

		const condition = regex.exec(args[0]);
		if (!condition) {
			await CustomFunctionError("argsCheck", args, 0, message, code, raw, "Needs to be: `<size`, `>size`, `<=size`, `>=size`, `!=size`, `==size`")
			error = true;
		} else {
			if (!checks[condition[0]]) {
				await message.channel.send(args[1]);
				error = true;
			}
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = argsCheck;