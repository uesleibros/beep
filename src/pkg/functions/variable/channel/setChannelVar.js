const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function setChannelVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("setChannelVar", ["string:non-op", "string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const channel = await client.channels.cache.get(args[2]);
		if (!channel) {
			await CustomFunctionError("setChannelVar", args, 2, message, code, raw, `Provided invalid channel id: "${args[2]}". Check if bot have access to this channel.`);
			error = true;
		} else {
			const isValid = await client.database.setTableValue("channelTable", { value: args[1], variableName: args[0], channelId: args[2] });

			switch (isValid) {
				case "undefined":
					await CustomFunctionError("setChannelVar", args, 0, message, code, raw, `Variable "${args[0]}" is not defined.`);
					error = true;
					break; 
				case "invalid-format":
					await CustomFunctionError("setChannelVar", args, 1, message, code, raw, `The value doesn't match with type of variable "${args[0]}", only accept "${client.variables[args[0]].type}" type.`);
					error = true;
					break;
			}
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setChannelVar;