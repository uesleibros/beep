const isInteractionFunction = require("./isInteractionFunction.js");
const FunctionLexer = require("./FunctionLexer.js");

async function parseArgs(client, message, args, options) {
	let listArgs = [...args];
	for (const idx in args) {
		let code = args[idx];

		const matches = FunctionLexer(code);
		let error;

		if (matches.length > 0) {
			for (const match of matches) {
				const FUNC_NAME = match.replace("$", "").split("[")[0];

				if (FUNC_NAME in client.functions) {
					const usingMessage = isInteractionFunction(FUNC_NAME) ? options.interactionMessage : options.commonMessage;
					const BEEP_FUNCTION = require(`${client.functions[FUNC_NAME]}/${FUNC_NAME}.js`);
					const func_result = await BEEP_FUNCTION(code, client, usingMessage, match, options);
					code = func_result.code;
					error = func_result.error;

					listArgs[idx] = code;

					if (error) return null;
				}
			}
		}
	}
	return listArgs;
}

module.exports = parseArgs;