const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute() {
		console.log("Beep::Client ready.");
	}
};