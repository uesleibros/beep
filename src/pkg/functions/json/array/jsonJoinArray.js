const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");

async function jsonJoinArray(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonJoinArray", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("jsonJoinArray", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (const key of args.toSpliced(-1)) {
				cJSON = cJSON[isNaN(key) ? key : Number(key)];
			}

			if (!Array.isArray(cJSON)) {
				await CustomFunctionError("jsonArrayCount", args, args.length - 2, message, code, raw, `Provided key "${args[args.length - 2]}" not is a list.`);
				error = true;
			} else {
				code = await FunctionResult(code, raw, cJSON.join(args[args.length - 1]));
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonJoinArray;