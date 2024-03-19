const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function jsonParse(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonParse", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		try {
			options.json.object = JSON.parse(args[0]);
		} catch (err) {
			await CustomFunctionError("jsonParse", args, 0, message, code, raw, `Invalid json format: **${err}**`);
			error = true;
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = jsonParse;