const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function updateValue(obj, path, errorRef, message) {
	const key = path.shift();
	if (!obj.hasOwnProperty(key)) {
		await message.channel.send(`\`$jsonUnset\` unable to traverse the path: **${key}** does not exist.`);
		errorRef.current = true;
		return;
	}

	if (path.length === 0) {
		delete obj[key];
	} else {
		await updateValue(obj[key], path, errorRef, message);
	}
};

async function jsonUnset(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonUnset", ["string:unlimited"], args, false, message);

	if (!error) {
		if (!options.json.object) {
			await message.channel.send("`$jsonUnset` unable to work, try define a json using: `$jsonParse[...]`.");
			error = true;
		} else {
			const cJSON = options.json.object;

         let errorRef = { current: false };
         await updateValue(cJSON, args.toSpliced(args.length - 1, 1), errorRef, message);
         error = errorRef.current;

			if (!error) {
				options.json.object = cJSON;
				code = await FunctionResult(code, raw, '');
			}
		}
	}

	return { code, error, options };
};

module.exports = jsonUnset;