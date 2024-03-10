const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function setVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("setVar", ["string:non-op", "string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[2]).catch(() => null);
		if (!user) {
			await message.channel.send("`setVar` invalid user id.");
			error = true;
		} else {
			await client.database.setGlobalUserVar(args[0], args[1], args[2]);
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setVar;