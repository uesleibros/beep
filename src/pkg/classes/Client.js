const fs = require("node:fs");
const path = require("node:path");
const { GatewayIntentBits, Partials } = require("discord.js");
const Discord = require("discord.js");

const _deployEvents = Symbol("deployEvents");

class Client extends Discord.Client {
	constructor(options) {
		options.intents = [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.DirectMessages
		];
		options.partials = [ Partials.Channel ];
		super(options);
		
		this.prefix = options.prefix || null;
		this.commands = {};
		this.listAwaitedCommands = [];
		this[_deployEvents](this);
		this.login(options.token);
	}

	createCommand(name, code) {
		this.commands[name] = { "code": code };
	}

	[_deployEvents](client) {
		const eventsPath = path.join(__dirname, "../events");
		const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);
			event.client = client;
			if (event.once) {
				this.once(event.name, (...args) => event.execute(...args));
			} else {
				this.on(event.name, (...args) => event.execute(...args));
			}
		}
	}
};

module.exports = Client;