const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");

async function jsonJoinArray(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonArrayCount", ["string:unlimited", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await message.channel.send("`$jsonJoinArray` unable to work, try define a json using: `$jsonParse[...]`.");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (key of args.toSpliced(args.length - 1, 1)) {
				cJSON = cJSON[isNaN(key) ? key : Number(key)];
			}

			if (!Array.isArray(cJSON)) {
				await message.channel.send("`$jsonJoinArray` provided key not result in a list.")
				error = true;
			} else {
				code = await FunctionResult(code, raw, cJSON.join(args[args.length - 1]));
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonJoinArray;