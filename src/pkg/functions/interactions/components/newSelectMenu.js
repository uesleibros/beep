const { StringSelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const Emoji = require("../../../helpers/parser/Emoji.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function newSelectMenu(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	const error = await FunctionError("newSelectMenu", ["boolean:non-op", "string:non-op", "number:non-op", "number:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let existsSelectMenu = false;
		for (const component of options.interactionComponents) {
			existsSelectMenu = component.components.some(menu => menu.data.type === ComponentType.SelectMenu && menu.data.custom_id === args[1]);
			if (existsSelectMenu) {
				await message.channel.send(`\`$newSelectMenu\` select menu with id: **${args[1]}** already exists.`);
				error = true;
				break
			}
		}
		const select = new StringSelectMenuBuilder()
			.setCustomId(args[1])
			.setMinValues(Number(args[2]))
			.setMaxValues(Number(args[3]))
			.setPlaceholder(args[4]);

		if (options.interactionComponents.length === 0)
			options.interactionComponents[options.curInteractionComponent] = new ActionRowBuilder();

		if (options.interactionComponents.length === 0)
			options.interactionComponents[options.curInteractionComponent] = new ActionRowBuilder();
		if (parseType(args[0]) && options.curInteractionComponent < 4) {
			options.curInteractionComponent += 1;
			if (!options.interactionComponents[options.curInteractionComponent])
				options.interactionComponents[options.curInteractionComponent] = new ActionRowBuilder();
		}


		let existsAlreadySelectMenu = false;
		for (const component of options.interactionComponents[options.curInteractionComponent].components) {
			if (component.data.type === ComponentType.SelectMenu) {
				await message.channel.send("alert: `$newSelectMenu` select menu components support only 1 per row.");
				existsAlreadySelectMenu = true;
				break;
			}
		}

		if (!existsAlreadySelectMenu)
			options.interactionComponents[options.curInteractionComponent].addComponents(select);
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = newSelectMenu;