const Condition = require("../../helpers/parser/Condition.js");
const FunctionLexer = require("../../helpers/FunctionLexer.js");
const isInteractionFunction = require("../isInteractionFunction.js");
const truncate = require("../../helpers/truncate.js");

async function InterpreterInteraction(client, messages, code, options) {
	let customMessage;
	code = truncate(code);

	const regex = /\{([^}]+)\}/g;
	const matches = code.match(regex);
	const [message, interactionMessage] = messages;
	options.interactionMessage = interactionMessage;

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
				await InterpreterInteraction(client, [message, interactionMessage], code, options);
				return;
			}

			if (FUNC_NAME in client.functions) {
				const usingMessage = isInteractionFunction(FUNC_NAME) ? interactionMessage : message;

				const BEEP_FUNCTION = require(`${client.functions[FUNC_NAME]}/${FUNC_NAME}.js`);
				const func_result = await BEEP_FUNCTION(code, client, usingMessage, match, options);
				code = func_result.code;
				error = func_result.error;
				options = func_result.options;

				if (func_result.returnHere)
					return;

				if (error) return;
			}
		}
	}

	if (options.msg.mentionAuthor)
		code = `<@${message.author.id}> ${code}`;

	const responseObject = { content: code };

	if (Object.keys(options.embed.data).length > 0)
		responseObject.embeds = [options.embed];

	if (options.interactionComponents.length > 0)
		responseObject.components = [ ...options.interactionComponents ];
	else
		responseObject.components = [];

	if (code.trim().length > 0 || Object.keys(options.embed.data).length > 0 || options.interactionComponents.length > 0)
		await interactionMessage.update(responseObject);
};

module.exports = InterpreterInteraction;