const structuredFunctions = require("./structuredFunctions.js");
const functions = structuredFunctions();

async function parseArgs(client, message, args, options = {}) {
	let listArgs = [...args];
	for (const idx in args) {
		let code = args[idx];
		const regex = /\$\w+(?:\[(?:[^\][]*|\[(?:[^\][]*|\[(?:[^\][]*)*\])*\])*\])?/g;;
		const matches = code.match(regex);
		let error;

		if (matches) {
			for (const match of matches) {
				const FUNC_NAME = match.replace("$", "").split("[")[0];

				if (FUNC_NAME in functions) {
					const BEEP_FUNCTION = require(`${functions[FUNC_NAME]}\\${FUNC_NAME}.js`);
					const func_result = await BEEP_FUNCTION(code, client, message, match, options);
					code = func_result.code;
					error = func_result.error;

					listArgs[idx] = code;

					if (error) return;
				} else {
					await message.channel.send(`⚠ | Invalid function \`\$${FUNC_NAME}\` is not defined.`);
					return;
				}
			}
		}
	}
	return listArgs;
};

module.exports = parseArgs;