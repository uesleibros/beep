const { StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const FunctionError = require("../../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../../helpers/result/FunctionResult.js");
const Emoji = require("../../../helpers/parser/Emoji.js");
const getFunctionArgs = require("../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../helpers/parseArgs.js");
const parseType = require("../../../helpers/parseType.js");

async function addOption(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("addOption", ["string:non-op", "string:non-op", "string:non-op", "string:non-op", "boolean:op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let validSelectMenu = false;
		for (const component of options.interactionComponents) {
			validSelectMenu = component.components.some(menu => menu.data.type === ComponentType.SelectMenu && menu.data.custom_id === args[0]);
			if (validSelectMenu)
				break
		}
		if (!validSelectMenu) {
			await message.channel.send("`$addOption` invalid custom id.");
			code = await FunctionResult(code, raw, '');
		} else {
			for (const componentIndex in options.interactionComponents) {
				for (const selectIndex in options.interactionComponents[componentIndex].components) {
					const selectMenu = options.interactionComponents[componentIndex].components[selectIndex];
					if (selectMenu.data.type === ComponentType.SelectMenu && selectMenu.data.custom_id === args[0]) {
						const emoji = await Emoji(client, args[5]);
						const option = new StringSelectMenuOptionBuilder()
								.setLabel(args[1])
								.setValue(args[2])
								.setDescription(args[3])
								.setDefault(args[4] ? parseType(args[4]) : false);

						if (emoji)
							option.setEmoji(emoji);
						let canAdd = true;
						for (menuOption of selectMenu.options) {
							if (menuOption.data.value === args[3]) {
								code = await FunctionResult(code, raw, "`$addOption` can't use same select menu option value: \"" + args[3] + "\"");
								canAdd = false;
								error = true;
								break;
							}
						}

						if (canAdd) {
							selectMenu.addOptions(option);
							options.interactionComponents[componentIndex].components[selectIndex] = selectMenu;
							code = await FunctionResult(code, raw, '');
							break;
						}
					}
				}
			}
		}
	}

	return { code, error, options };
};

module.exports = addOption;