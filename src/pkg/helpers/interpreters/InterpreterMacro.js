const FunctionError = require("../errors/FunctionError.js");
const FunctionResult = require("../result/FunctionResult.js");
const FunctionLexer = require("../FunctionLexer.js");
const Condition = require("../parser/Condition.js");
const parseArgs = require("../parseArgs.js");

async function InterpreterMacro(code, client, message, raw, options, changedMacroCode = null) {
	const args = await parseArgs(client, message, options.macro.arguments, options);
	let error = await FunctionError(options.macro.name, client.macros[options.macro.name].args, args, client.macros[options.macro.name].canUseWithoutArgs, options.originalCode, raw, message, "@");

	let macroCode = changedMacroCode || client.macros[options.macro.name].code;

	if (!error) {
		const regex = /\{([^}]+)\}/g;
		const matches = client.macros[options.macro.name].code.match(regex);

		if (matches) {
			for (const match of matches) {
				const varName = match.slice(1, -1);
				if (varName in options.envVariables) {
					const varValue = options.envVariables[varName];
					macroCode = macroCode.replace(match, varValue);
				}
			}
		}

		const commandMatches = FunctionLexer(macroCode);

		if (commandMatches.length > 0) {
			for (const match of commandMatches) {
				const FUNC_NAME = match.replace(/[\$@]/g, "").split("[")[0];

				if (FUNC_NAME === "if") {
					macroCode = await Condition(client, message, macroCode, options);
					return await InterpreterMacro(code, client, message, raw, options, macroCode);
				}

				if (FUNC_NAME in client.functions) {
					const BEEP_FUNCTION = require(`${client.functions[FUNC_NAME]}/${FUNC_NAME}.js`);
					const func_result = await BEEP_FUNCTION(macroCode, client, message, match, options);
					error = func_result.error;
					options = func_result.options;

					if (func_result.returnHere)
						return InterpreterMacro(code, client, message, raw, options, macroCode);
				}
			}
		}
		options.macro.name = null;
		code = await FunctionResult(code, raw, options.macro.result);
		options.macro.result = '';
	}

	await message.channel.send("**From - Beep Support**: Please note that macros are currently under development and are a new concept, which may contain bugs. Thank you for your understanding and patience as we work to improve them.");

	return { code, error, options };
};

module.exports = InterpreterMacro;