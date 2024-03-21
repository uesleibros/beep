const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function isJSON(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("isJSON", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let isValidJSON = false;
		try {
			JSON.parse(args[0]);
			isValidJSON = true;
		} catch (_) {}
		
		code = await FunctionResult(code, raw, isValidJSON);
	}

	return { code, error, options };
};

module.exports = isJSON;