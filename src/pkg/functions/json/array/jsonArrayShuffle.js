const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");

function shuffleArray(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

async function jsonArrayShuffle(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonArrayShuffle", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("jsonArrayShuffle", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (const key of args) {
				cJSON = cJSON[isNaN(key) ? key : Number(key)];
			}

			if (!Array.isArray(cJSON)) {
				await CustomFunctionError("jsonArrayShuffle", args, args.length - 1, message, code, raw, `Provided key "${key}" not is a list.`);
				error = true;
			} else {
				shuffleArray(cJSON)
				code = await FunctionResult(code, raw, '');
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonArrayShuffle;