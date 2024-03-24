const { Events, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const interpreter = require("../interpreter.js");
const messageCollectorHandler = require("../handlers/messageCollectorHandler.js");
const reactionCollectorHandler = require("../handlers/reactionCollectorHandler.js");
const interactionCollectorHandler = require("../handlers/interactionCollectorHandler.js");
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
		const request = { object: null, headers: {} };
		const msg = { mentionAuthor: true, reply: false, replyIn: null };
		const json = { object: null };
		const array = {};
		const loop = { break: false };
		const macro = { name: null, arguments: [], result: '', };
		const interactionHandler = null;
		const reactionHandler = null;
		const awaitedCommandHandler = null;
		const interactionComponents = [];
		const curInteractionComponent = 0;
		const commonMessage = message;
		const botMessage = null;
		const options = { embed, string, variables, envVariables, msg, json, array, loop, macro, awaitedCommandHandler, interactionComponents, curInteractionComponent, interactionHandler, reactionHandler, commonMessage, botMessage, request };

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
						await interpreter(this.client, options.commonMessage, this.client.commands[COMMAND_NAME].code, options);

						messageCollectorHandler(this.client, options.commonMessage, options);
						reactionCollectorHandler(this.client, [options.commonMessage, options.botMessage], options);
						interactionCollectorHandler(this.client, [options.commonMessage, options.botMessage], options);
						return;
					}
				}
			}
		}
	}
};