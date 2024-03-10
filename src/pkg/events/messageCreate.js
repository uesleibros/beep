const { Events, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const interpreter = require("../interpreter.js");
const messageCollectorHandler = require("../handlers/messageCollectorHandler.js");
const interactionButtonCollectorHandler = require("../handlers/interactionButtonCollectorHandler.js");
const truncate = require("../helpers/truncate.js");

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
		const listAwaitedCommands = [];
		const interactionButtonHandler = null;
		const interactionComponents = [];
		const curInteractionComponent = 0;
		const commonMessage = message;
		const options = { embed, string, variables, envVariables, msg, json, loop, listAwaitedCommands, interactionComponents, curInteractionComponent, interactionButtonHandler, commonMessage };

		if (this.client.prefix) {
			if (message.content.startsWith(this.client.prefix)) {
				let former_cmd = '';
				const ARGS = message.content.slice(this.client.prefix.length).trim().split(/\s+/);
				for (const arg of ARGS) {
					former_cmd += ` ${arg}`;
					if (former_cmd.trim() in this.client.commands) {
						if (!this.client.commands[former_cmd.trim()].can_call)
							continue;
						const COMMAND_NAME = former_cmd.trim();
						options.commonMessage.content = options.commonMessage.content.slice(COMMAND_NAME.length + 1).trim();
						const botMessage = await interpreter(this.client, options.commonMessage, this.client.commands[COMMAND_NAME].code, options);

						messageCollectorHandler(this.client, options.commonMessage, options);
						interactionButtonCollectorHandler(this.client, [options.commonMessage, botMessage], options);
						return;
					}
				}
			}
		}
	}
};