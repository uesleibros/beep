const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function updateValue(obj, path, value, errorRef, message) {
	const key = path.shift();
	if (!obj.hasOwnProperty(key)) {
		await message.channel.send(`\`$jsonArrayUnshift\` unable to traverse the path: **${key}** does not exist.`);
		errorRef.current = true;
		return;
	}

	if (path.length === 0) {
		if (!Array.isArray(obj[key])) {
			await message.channel.send(`\`$jsonArrayUnshift\` unable to traverse the path "**${key}**", it's not an array.`);
			errorRef.current = true;
			return;
		}
		obj[key].unshift(parseType(value));
	} else {
		await updateValue(obj[key], path, value, errorRef, message);
	}
};

async function jsonArrayUnshift(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonArrayUnshift", ["string:unlimited", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!options.json.object) {
			await message.channel.send("`$jsonArrayUnshift` unable to work, try define a json using: `$jsonParse[...]`.");
			error = true;
		} else {
			const cJSON = options.json.object;
			const setValue = args[args.length - 1];

         let errorRef = { current: false };
         await updateValue(cJSON, args.toSpliced(args.length - 1, 1), setValue, errorRef, message);
         error = errorRef.current;

			if (!error) {
				options.json.object = cJSON;
				code = await FunctionResult(code, raw, '');
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonArrayUnshift;