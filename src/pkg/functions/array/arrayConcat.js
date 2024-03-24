const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function arrayConcat(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("arrayConcat", ["string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		const concatenated = [];
		for (const array of args.slice(1)) {
			if (!options.array[array]) {
				await CustomFunctionError("arrayConcat", args, args.indexOf(array), message, code, raw, `Array "${array}" doesn't exist.`);
				error = true;
			} else {
				concatenated.push(...options.array[array]);
			}
		}

		code = await FunctionResult(code, raw, concatenated.join(args[0]));
	}

	return { code, error, options };
};

module.exports = arrayConcat;