const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function resetGlobalUserVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("resetGlobalUserVar", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[1]).catch(() => null);
		if (!user) {
			await CustomFunctionError("resetGlobalUserVar", args, 1, message, code, raw, `Invalid user id: "${args[1]}".`);
			error = true;
		} else {
			await client.database.resetTableValue("userGlobalTable", { variableName: args[0], id: args[1] });
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = resetGlobalUserVar;