const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const InterpreterInteraction = require("../helpers/interpreters/InterpreterInteraction.js");

function interactionCollectorHandler(client, messages, options) {
	if (options.interactionComponents.length > 0) {
		let [authorMessage, botMessage] = messages;

		const collector = botMessage.createMessageComponentCollector({
			filter: (m) => m.channelId === botMessage.channel.id,
			time: 30_000
		});

		collector.on("collect", async (interaction) => {
			if (options.interactionHandler) {
				options.embed = new EmbedBuilder();
				await InterpreterInteraction(client, [authorMessage, interaction], options.interactionHandler, options);
				collector.resetTimer({ time: 30_000 });
				return;
			}
		});

		collector.on("end", () => {
			options.interactionButtonHandler = null;
		});
	}
};

module.exports = interactionCollectorHandler;