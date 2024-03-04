const Client = require("../src/pkg/classes/Client.js");

bot = new Client({ "intents": ["MessageContent", "Guilds", "GuildMessages"], "token": "TOKEN_HERE", "prefix": "!" });

bot.createCommand(
	"teste",
	`
		Olá, me diga qual é o seu nome?
		$awaitFunc[obterNome]
	`
);

bot.createCommand(
	"obterNome",
	`
		Uau, seu nome é: **$message**.
		Agora quero saber seu gênero!
		$awaitFunc[obterGen]
	`
);

bot.createCommand(
	"obterGen",
	`
		Ok, seu gênero é $message.
	`
)