const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function resetChannelVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("resetChannelVar", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const channel = await client.channels.cache.get(args[1]);
		if (!channel) {
			await CustomFunctionError("resetChannelVar", args, 1, message, code, raw, `Provided invalid channel id: "${args[1]}". Check if bot have access to this channel.`);
			error = true;
		} else {
			await client.database.resetTableValue("channelTable", { variableName: args[0], channelId: args[1] });
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = resetChannelVar;