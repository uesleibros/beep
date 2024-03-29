const FunctionError = require("../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function updateValue(obj, path, removedValue, errorRef, message, code, raw) {
	const key = path.shift();
	if (!obj.hasOwnProperty(key)) {
		await CustomFunctionError("jsonArrayRemove", path, path.length + 1, message, code, raw, `Unable to traverse the path: "${path[path.length - 1]}" does not exist.`);
		errorRef.current = true;
		return;
	}

	if (path.length === 0) {
		if (Array.isArray(obj[key])) {
			await CustomFunctionError("jsonArrayRemove", path, path.length + 1, message, code, raw, `Unable to traverse the path: "${path[path.length - 1]}" it's not a index.`);
			errorRef.current = true;
			return;
		}
		removedValue.current = obj[Number(key)];
		obj.splice(Number(key), 1);
	} else {
		await updateValue(obj[key], path, removedValue, errorRef, message, code, raw);
	}
};

async function jsonArrayRemove(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonArrayRemove", ["string:unlimited", "number:non-op", "boolean:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("jsonArrayRemove", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			const cJSON = options.json.object;

         let errorRef = { current: false };
         let removedValue = { current: '' };
         await updateValue(cJSON, typeof parseType(args[args.length - 1]) === "boolean" ? args.toSpliced(args.length - 1, 1) : args.slice(), removedValue, errorRef, message, code, raw);
         error = errorRef.current;

			if (!error) {
				options.json.object = cJSON;
				code = await FunctionResult(code, raw, ["true", "false"].includes(parseType(args[args.length - 1]).toString()) ? removedValue.current : '');
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonArrayRemove;