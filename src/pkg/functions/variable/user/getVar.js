const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function getVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("getVar", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[1]).catch(() => null);
		if (!user) {
			await message.channel.send("`getVar` invalid user id.");
			error = true;
		} else {
			const res = await client.database.getGlobalUserVar(args[0], args[1]);
			if (!res) {
				await message.channel.send("`$getVar` Failed to find variable named '" + args[0] + "'");
				error = true;
			} else {
				code = await FunctionResult(code, raw, res);
			}
		}
	}

	return { code, error, options };
}

module.exports = getVar;