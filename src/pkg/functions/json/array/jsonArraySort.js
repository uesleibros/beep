const FunctionError = require("../../../helpers/errors/FunctionError.js");
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
			await message.channel.send("`$jsonArraySort` unable to work, try define a json using: `$jsonParse[...]`.");
			error = true;
		} else {
			let cJSON = options.json.object;

			for (key of args) {
				cJSON = cJSON[isNaN(key) ? key : Number(key)];
			}

			if (!Array.isArray(cJSON)) {
				await message.channel.send("`$jsonArraySort` provided key not result in a list.")
				error = true;
			} else {
				code = await FunctionResult(code, raw, makeSort(cJSON));
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonArraySort;