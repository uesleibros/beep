const interpreter = require("../interpreter.js");

function messageCollectorHandler(client, message, options) {
	if (options.listAwaitedCommands.length > 0) {
		let latestAwaitedCommand;
		let indexOfLatestAwaitedCommand;

		const collector = message.channel.createMessageCollector({
			filter: (m) => m.author.id === message.author.id && m.channel.id === message.channel.id,
			time: 10_000
		});

		options.listAwaitedCommands.forEach((awc, index) => {
			if (awc.includes(message.author.id)) {
				latestAwaitedCommand = awc;
				indexOfLatestAwaitedCommand = index;
			}
		});

		collector.on("collect", (m) => {
			if (latestAwaitedCommand) {
				interpreter(client, m, client.commands[latestAwaitedCommand[1]].code, options);
				options.listAwaitedCommands.splice(indexOfLatestAwaitedCommand, 1);
				collector.stop();
			}
		});

		collector.on("end", () => {
			options.listAwaitedCommands.splice(0, options.listAwaitedCommands.length);
		});
	}
};

module.exports = messageCollectorHandler;