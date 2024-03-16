const InterpreterReaction = require("../helpers/interpreters/InterpreterReaction.js");

function reactionCollectorHandler(client, messages, options) {
	if (options.reactionHandler) {
		let [authorMessage, botMessage] = messages;
		const collector = botMessage.createReactionCollector({
			filter: (reaction, user) => !user.bot,
			time: 60_000
		});

		collector.on("collect", async (r) => {
			await InterpreterReaction(client, [authorMessage, r], options.reactionHandler, options);
		});

		collector.on("end", () => {
			options.reactionHandler = null;
		});
	}
};

module.exports = reactionCollectorHandler;