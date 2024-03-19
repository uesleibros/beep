const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");

async function jsonArrayIndex(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonArrayIndex", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("jsonArrayIndex", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (key of args.toSpliced(args.length - 1, 1)) {
				cJSON = cJSON[isNaN(key) ? key : Number(key)];
			}

			if (!Array.isArray(cJSON)) {
				await message.channel.send("`$jsonArrayCount` provided key not result in a list.")
				error = true;
			} else {
				const index = cJSON.indexOf(args[args.length - 1]);
				code = await FunctionResult(code, raw, index < 0 ? -1 : index + 1);
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonArrayIndex;