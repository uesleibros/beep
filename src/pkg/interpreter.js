const InterpreterBasic = require("./helpers/interpreters/InterpreterBasic.js");

async function interpreter(client, message, code, options, send_message = true) {
	let customMessage;
	options.originalCode = code;

	let props = await InterpreterBasic(client, message, code, options);
	code = props[0];
	let error = props[1];
	let commandWaitList = props[2];
	if (error) return;

	if (send_message) {
		if (options.msg.mentionAuthor)
			code = `<@${message.author.id}> ${code}`;

		const responseObject = { content: code };

		if (Object.keys(options.embed.data).length > 0)
			responseObject.embeds = [options.embed];

		if (options.interactionComponents.length > 0)
			responseObject.components = [ ...options.interactionComponents ];

		if (code.trim().length > 0 || Object.keys(options.embed.data).length > 0 || options.interactionComponents.length > 0) {
			try {
				customMessage = await message.channel.send(responseObject);
			} catch (err) {
				await message.channel.send("Beep Parser error: **" + err + "**");
				error = true;
				return;
			}
		}
	}

	if (commandWaitList.length > 0) {
		for (const command of commandWaitList) {
			const BEEP_FUNCTION = require(`${client.functions[command[0]]}\\${command[0]}.js`);
			const func_result = await BEEP_FUNCTION(code, client, customMessage, command[1], options);
			code = func_result.code;
			error = func_result.error;
			options = func_result.options;

			if (error) return;
		}
	}
	options.botMessage = customMessage;
}

module.exports = interpreter;