const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function jsonArrayIndex(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonArrayIndex", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("jsonArrayIndex", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (const key of args.toSpliced(-1)) {
				cJSON = cJSON[isNaN(key) ? key : Number(key)];
			}

			if (!Array.isArray(cJSON)) {
				await CustomFunctionError("jsonArrayIndex", args, args.length - 2, message, code, raw, `Provided key "${args[args.length - 2]}" not is a list.`);
				error = true;
			} else {
				const index = cJSON.indexOf(parseType(args[args.length - 1]));
				code = await FunctionResult(code, raw, index < 0 ? -1 : index);
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonArrayIndex;