const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function getChannelVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("getChannelVar", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const channel = await client.channels.cache.get(args[1]);
		if (!channel) {
			await CustomFunctionError("getChannelVar", args, 1, message, code, raw, `Provided invalid channel id: "${args[1]}". Check if bot have access to this channel.`);
			error = true;
		} else {
			const res = await client.database.getTableValue("channelTable", { variableName: args[0], channelId: args[1] });
			if (!res) {
				await CustomFunctionError("getChannelVar", args, 0, message, code, raw, `Variable "${args[0]}" not defined.`);
				error = true;
			} else {
				code = await FunctionResult(code, raw, res);
			}
		}
	}

	return { code, error, options };
}

module.exports = getChannelVar;