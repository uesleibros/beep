const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");

function makeSort(arr) {
	return arr.sort((a, b) => {
		if (typeof a === "number" && typeof b === "number") {
			return a - b;
		} else if (typeof a === "number") {
			return -1;
		} else if (typeof b === "number") {
			return 1;
		} else {
			return a.localeCompare(b);
		}
	})
}

async function jsonArraySort(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonArraySort", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("jsonArraySort", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (const key of args) {
				cJSON = cJSON[isNaN(key) ? key : Number(key)];
			}

			if (!Array.isArray(cJSON)) {
				await CustomFunctionError("jsonArraySort", args, args.length - 1, message, code, raw, `Provided key "${key}" not is a list.`);
				error = true;
			} else {
				makeSort(cJSON)
				code = await FunctionResult(code, raw, '');
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonArraySort;