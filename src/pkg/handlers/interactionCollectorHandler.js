const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const InterpreterInteraction = require("../helpers/interpreters/InterpreterInteraction.js");

function interactionCollectorHandler(client, messages, options) {
	if (options.interactionComponents.length > 0) {
		let [authorMessage, botMessage] = messages;

		const collector = authorMessage.channel.createMessageComponentCollector({
			filter: (m) => m.channelId === authorMessage.channel.id,
			time: 60_000
		});

		collector.on("collect", async (interaction) => {
			console.log(interaction)
			if (options.interactionHandler) {
				options.embed = new EmbedBuilder();
				await InterpreterInteraction(client, [authorMessage, interaction], options.interactionHandler, options);
				return;
			}
		});

		collector.on("end", () => {
			options.interactionButtonHandler = null;
		});
	}
};

module.exports = interactionCollectorHandler;