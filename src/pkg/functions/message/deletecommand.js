const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function deletecommand(code, client, message, raw, options) {
	const args = getFunctionArgs(raw)
	const error = await FunctionError("deletecommand", [], args, true, message);

	if (!error) {
		try {
			await message.delete();
		} catch (_) {}
		
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = deletecommand;