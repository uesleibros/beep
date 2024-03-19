const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function setVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("setVar", ["string:non-op", "string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[2]).catch(() => null);
		if (!user) {
			await CustomFunctionError("setVar", args, 1, message, code, raw, `Invalid user id: "${args[1]}".`);
			error = true;
		} else {
			await client.database.setTableValue("userGlobalTable", { value: args[1], variableName: args[0], id: args[2] });
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setVar;