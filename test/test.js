const Client = require("../src/pkg/classes/Client.js");
require("dotenv").config();

bot = new Client({ "intents": ["MessageContent", "Guilds", "GuildMessages"], "token": process.env.BOT_TOKEN, "prefix": "!" });

bot.createCommand(
	"teste",
	`
		$argsCheck[<1;oi]
	`
);