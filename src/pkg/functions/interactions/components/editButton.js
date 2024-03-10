const { ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const Emoji = require("../../../helpers/parser/Emoji.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function editButton(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("editButton", ["string:non-op", "boolean:non-op", "string:non-op", "string:non-op", "boolean:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let validButton = false;
		for (const component of options.interactionComponents) {
			validButton = component.components.some(button => button.data.type === ComponentType.Button && button.data.custom_id === args[0]);
			if (validButton)
				break
		}
		if (!validButton) {
			await message.channel.send("`$editButton` invalid custom id.");
		} else {
			if (!["primary", "secondary", "success", "danger", "link"].includes(args[3])) {
				await message.channel.send("`$editButton` invalid button style.");
				error = true;
			} else {
				for (const componentIndex in options.interactionComponents) {
					for (const buttonIndex in options.interactionComponents[componentIndex].components) {
						const button = options.interactionComponents[componentIndex].components[buttonIndex];
						if (button.data.type === ComponentType.Button && button.data.custom_id === args[0]) {
							const styles = {
								"primary": ButtonStyle.Primary,
								"secondary": ButtonStyle.Secondary,
								"success": ButtonStyle.Success,
								"danger": ButtonStyle.Danger,
								"link": ButtonStyle.Link
							};

							const emoji = await Emoji(client, args[5]);
							const editedButton = new ButtonBuilder()
								.setLabel(args[2].length === 0 ? ' ' : args[2])
								.setStyle(styles[args[3]])
								.setDisabled(parseType(args[4]))
								.setCustomId(button.data.custom_id);

							if (emoji)
								editedButton.setEmoji(emoji);

							options.interactionComponents[componentIndex].components[buttonIndex] = editedButton;
							break;
						}
					}
				}
			}
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = editButton;