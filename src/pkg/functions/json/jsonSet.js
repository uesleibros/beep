const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function updateValue(obj, path, value, errorRef, message, code, raw) {
	const key = path.shift();
	if (!obj.hasOwnProperty(key)) {
		await CustomFunctionError("jsonSet", path, path.length + 1, message, code, raw, `Unable to traverse the path: "${path[path.length - 1]}" does not exist.`);
		errorRef.current = true;
		return;
	}

	if (path.length === 0) {
		if (typeof obj[key] === "object" || Array.isArray(obj[key])) {
			await CustomFunctionError("jsonSet", path, path.length + 1, message, code, raw, `Can't set value to an object|array "${path[path.length - 1]}"`);
			errorRef.current = true;
			return;
		}
		obj[key] = parseType(value);
	} else {
		await updateValue(obj[key], path, value, errorRef, message, code, raw);
	}
};

async function jsonSet(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonSet", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await CustomFunctionError("jsonSet", args, -1, message, code, raw, "Unable to work without parsed json object, try define a json using: `$jsonParse[...]`");
			error = true;
		} else {
			const cJSON = options.json.object;
			const setValue = args[args.length - 1];

         let errorRef = { current: false };
         await updateValue(cJSON, args.toSpliced(args.length - 1, 1), setValue, errorRef, message, code, raw);
         error = errorRef.current;

			if (!error) {
				options.json.object = cJSON;
				code = await FunctionResult(code, raw, '');
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonSet;