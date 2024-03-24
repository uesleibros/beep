const interpreter = require("../interpreter.js");

function messageCollectorHandler(client, message, options) {
	const collector = message.channel.createMessageCollector({
		filter: (m) => m.author.id === message.author.id && m.channel.id === message.channel.id,
		time: 30_000
	});

	collector.on("collect", (m) => {
		if (options.awaitedCommandHandler) {
			interpreter(client, m, client.commands[options.awaitedCommandHandler].code, options);
			collector.stop();
		}
	});

	collector.on("end", () => {
		options.awaitedCommandHandler = null;
	});
};

module.exports = messageCollectorHandler;