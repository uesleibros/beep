const Condition = require("../../helpers/parser/Condition.js");
const FunctionLexer = require("../../helpers/FunctionLexer.js");
const InterpreterMacro = require("./InterpreterMacro.js");
const getFunctionArgs = require("../getFunctionArgs.js");
const truncate = require("../../helpers/truncate.js");

async function InterpreterBasic(client, message, code, options) {
	const commandWaitList = [];
	code = truncate(code);

	const regex = /\{([^}]+)\}/g;
	const matches = code.match(regex);

	if (matches) {
		for (const match of matches) {
			const varName = match.slice(1, -1);
			if (varName in options.envVariables) {
				const varValue = options.envVariables[varName];
				code = code.replace(match, varValue);
			}
		}
	}

	const commandMatches = FunctionLexer(code);
	let error;

	if (commandMatches.length > 0) {
		for (const match of commandMatches) {
			const FUNC_NAME = match.replace(/[\$@]/g, "").split("[")[0];

			if (FUNC_NAME === "if") {
				code = await Condition(client, message, code, options);
				return await InterpreterBasic(client, message, code, options);
			}

			if (FUNC_NAME in client.functions) {
				if (["addReactions", "editButton"].includes(FUNC_NAME)) {
					commandWaitList.push([FUNC_NAME, match]);
					code = code.replace(match, '');
					continue;
				}

				const BEEP_FUNCTION = require(`${client.functions[FUNC_NAME]}/${FUNC_NAME}.js`);
				const func_result = await BEEP_FUNCTION(code, client, message, match, options);
				code = func_result.code;
				error = func_result.error;
				options = func_result.options;

				if (func_result.returnHere)
					return InterpreterBasic(client, message, code, options);

				if (error) return [code, error, commandWaitList];
			} else if (Object.keys(client.macros).includes(FUNC_NAME)) {
				options.macro.arguments = getFunctionArgs(match);
				options.macro.name = FUNC_NAME;
				const func_result = await InterpreterMacro(code, client, message, match, options);
				code = func_result.code;
				error = func_result.error;
				options = func_result.options;

				if (error) return [code, error, commandWaitList];
			}
		}
	}
	return [code, error, commandWaitList];
};

module.exports = InterpreterBasic;