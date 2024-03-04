const structuredFunctions = require("./helpers/structuredFunctions.js");
const Condition = require("./helpers/parser/Condition.js");
const Loop = require("./helpers/parser/Loop.js");
const functions = structuredFunctions();

async function interpreter(client, message, code, options, send_message = true) {
	const commandWaitList = [];
	let customMessage;
	code = code.split('\n').map(line => line.trim()).join("\n");
	code = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

	const regex = /\{([^}]+)\}/g;
	const matches = code.match(regex);

	if (matches) {
		for (const match of matches) {
			const varName = match.slice(1, -1);
			if (options.envVariables && varName in options.envVariables) {
				const varValue = options.envVariables[varName];
				code = code.replace(match, varValue);
			}
		}
	}

	const commandRegex = /\$\w+(?:\[(?:[^\[\]]*|\[(?:[^\[\]]*|\[(?:[^\[\]]*)*\])*\])*\])?/g;
	const commandMatches = code.match(commandRegex);
	let error;

	if (commandMatches) {
		for (const match of commandMatches) {
			const FUNC_NAME = match.replace("$", "").split("[")[0];

			if (FUNC_NAME === "if") {
				code = await Condition(client, message, code, options);
				await interpreter(client, message, code, options);
				return;
			} else if (FUNC_NAME === "for") {
				code = await Loop(client, message, code, options, interpreter);
				await interpreter(client, message, code, options);
				return;
			}

			if (FUNC_NAME in functions) {
				if (["addReactions"].includes(FUNC_NAME)) {
					commandWaitList.push([FUNC_NAME, match]);
					code = code.replace(match, '');
					continue;
				}

				const BEEP_FUNCTION = require(`${functions[FUNC_NAME]}\\${FUNC_NAME}.js`);
				const func_result = await BEEP_FUNCTION(code, client, message, match, options);
				code = func_result.code;
				error = func_result.error;
				options = func_result.options;

				if (error) return;
			} else {
				await message.channel.send(`⚠ | Invalid function \`\$${FUNC_NAME}\` is not defined.`);
				return;
			}
		}
	}

	if (send_message) {
		const responseObject = { content: code };
		if (Object.keys(options.embed.data).length > 0)
			responseObject.embeds = [options.embed];

		if (code.trim().length > 0 || Object.keys(options.embed.data).length > 0) {
			customMessage = await message.channel.send(responseObject);
		}

		if (commandWaitList.length > 0) {
			for (const command of commandWaitList) {
				const BEEP_FUNCTION = require(`${functions[command[0]]}\\${command[0]}.js`);
				const func_result = await BEEP_FUNCTION(code, client, customMessage, command[1], options);
				code = func_result.code;
				error = func_result.error;
				options = func_result.options;

				if (error) return;
			}
		}
	}
};

module.exports = interpreter;