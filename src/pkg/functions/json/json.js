const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function json(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("json", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("json", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (key of args) {
				try {
					cJSON = cJSON[isNaN(key) ? key : Number(key)];
				} catch (_) {
					cJSON = null;
				}
			}

			if (typeof cJSON === "object" || Array.isArray(cJSON))
				cJSON = JSON.stringify(cJSON);
			code = await FunctionResult(code, raw, parseType(cJSON));
		}
	}

	return { code, error, options };
};

module.exports = json;