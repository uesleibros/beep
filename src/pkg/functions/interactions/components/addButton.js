const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const Emoji = require("../../../helpers/parser/Emoji.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function addButton(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("addButton", ["boolean:non-op", "string:non-op", "string:non-op", "string:non-op", "boolean:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let existsButton = false;
		for (const component of options.interactionComponents) {
			existsButton = component.components.some(button => button.data.type === ComponentType.Button && button.data.custom_id === args[1]);
			if (existsButton) {
				await message.channel.send(`\`$addButton\` button with id: **${args[1]}** already exists.`);
				error = true;
				break
			}
		}
		if (!["primary", "secondary", "success", "danger", "link"].includes(args[3]) && !existsButton) {
			await message.channel.send("`$addButton` invalid button style.");
			error = true;
		} else {
			const styles = {
				"primary": ButtonStyle.Primary,
				"secondary": ButtonStyle.Secondary,
				"success": ButtonStyle.Success,
				"danger": ButtonStyle.Danger,
				"link": ButtonStyle.Link
			};
			const emoji = await Emoji(client, args[5]);
			const button = new ButtonBuilder()
				.setLabel(args[2].length === 0 ? ' ' : args[2])
				.setStyle(styles[args[3]])
				.setDisabled(parseType(args[4]));

			if (emoji)
				button.setEmoji(emoji);
			
			if (args[3] === "link")
				button.setURL(args[1]);
			else
				button.setCustomId(args[1]);

			if (options.interactionComponents.length === 0)
				options.interactionComponents[options.curInteractionComponent] = new ActionRowBuilder();
			if (parseType(args[0]) && options.curInteractionComponent < 4) {
				options.curInteractionComponent += 1;
				if (!options.interactionComponents[options.curInteractionComponent])
					options.interactionComponents[options.curInteractionComponent] = new ActionRowBuilder();
			}

			if (options.interactionComponents[options.curInteractionComponent].components.length < 5)
				options.interactionComponents[options.curInteractionComponent].addComponents(button);
			else
				await message.channel.send("alert: `$addButton` buttons components support only 5 per row.");
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
};

module.exports = addButton;