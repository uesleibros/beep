const Condition = require("../../helpers/parser/Condition.js");
const FunctionLexer = require("../../helpers/FunctionLexer.js");
const isReactionFunction = require("../isReactionFunction.js");
const truncate = require("../../helpers/truncate.js");

async function InterpreterReaction(client, messages, code, options) {
	let customMessage;
	code = truncate(code);

	const regex = /\{([^}]+)\}/g;
	const matches = code.match(regex);
	const [message, reactionMessage] = messages;
	options.reactionMessage = reactionMessage;

	if (matches) {
		for (const match of matches) {
			const varName = match.slice(1, -1);
			if (options.envVariables && varName in options.envVariables) {
				const varValue = options.envVariables[varName];
				code = code.replace(match, varValue);
			}
		}
	}

	const commandMatches = FunctionLexer(code);

	let error;

	if (commandMatches.length > 0) {
		for (const match of commandMatches) {
			const FUNC_NAME = match.replace("$", "").split("[")[0];

			if (FUNC_NAME === "if") {
				code = await Condition(client, message, code, options);
				await InterpreterReaction(client, [message, reactionMessage], code, options);
				return;
			}

			if (FUNC_NAME in client.functions) {
				const usingMessage = isReactionFunction(FUNC_NAME) ? reactionMessage : message;

				const BEEP_FUNCTION = require(`${client.functions[FUNC_NAME]}/${FUNC_NAME}.js`);
				const func_result = await BEEP_FUNCTION(code, client, usingMessage, match, options);
				code = func_result.code;
				error = func_result.error;
				options = func_result.options;

				if (FUNC_NAME === "for") {
					return await InterpreterReaction(client, message, code, options);
				}

				if (error) return;
			}
		}
	}
};

module.exports = InterpreterReaction;