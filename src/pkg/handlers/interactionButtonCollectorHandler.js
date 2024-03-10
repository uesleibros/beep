const { ComponentType, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const InterpreterInteraction = require("../helpers/interpreters/InterpreterInteraction.js");

function interactionButtonCollectorHandler(client, messages, options) {
	if (options.interactionComponents.length > 0) {
		let [authorMessage, botMessage] = messages;

		const collector = authorMessage.channel.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: (m) => m.channelId === authorMessage.channel.id,
			time: 20_000
		});

		collector.on("collect", async (interaction) => {
			if (options.interactionButtonHandler) {
				options.embed = new EmbedBuilder();
				await InterpreterInteraction(client, [authorMessage, interaction], options.interactionButtonHandler, options);
				return;
			}
		});

		collector.on("end", () => {
			options.interactionButtonHandler = null;
		});
	}
};

module.exports = interactionButtonCollectorHandler;