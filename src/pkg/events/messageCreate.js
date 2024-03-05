const { Events, EmbedBuilder } = require("discord.js");
const interpreter = require("../interpreter.js");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	client: null,
	async execute(message) {
		if (message.author.id === this.client.user.id) return;
		const embed = new EmbedBuilder();
		const string = { textSplit: [] };
		const variables = {};
		const envVariables = {};
		const msg = { mentionAuthor: true };
		const json = { object: null };
		const loop = { break: false };


		if (this.client.prefix) {
			if (message.content.startsWith(this.client.prefix)) {
				let former_cmd = '';
				const ARGS = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
				for (const arg of ARGS) {
					former_cmd += ` ${arg}`;
					if (former_cmd.trim() in this.client.commands) {
						const COMMAND_NAME = former_cmd.trim();
						message.content = message.content.slice(COMMAND_NAME.length + 1).trim();
						await interpreter(this.client, message, this.client.commands[COMMAND_NAME].code, { embed, string, variables, envVariables, msg, json, loop });
						return;
					}
				}
			}
		}

		if (this.client.listAwaitedCommands.length > 0) {
			let latestAwaitedCommand;
			let indexOfLatestAwaitedCommand;

			this.client.listAwaitedCommands.forEach((awc, index) => {
				if (awc.includes(message.author.id)) {
					latestAwaitedCommand = awc;
					indexOfLatestAwaitedCommand = index;
				}
			});

			if (latestAwaitedCommand) {
				console.log(this.client.listAwaitedCommands);
				await interpreter(this.client, message, this.client.commands[latestAwaitedCommand[1]].code, { embed, string, variables, envVariables, msg, loop });
				this.client.listAwaitedCommands.splice(indexOfLatestAwaitedCommand, 1);
			}
		}
	}
};