const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function randomString(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("randomString", ["number:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		let result = '';
		let counter = 0;

		while (counter < Number(args[0])) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		code = await FunctionResult(code, raw, result);
	}
	return { code, error, options };
}

module.exports = randomString;