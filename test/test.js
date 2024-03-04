const Client = require("../src/pkg/classes/Client.js");

bot = new Client({ "intents": ["MessageContent", "Guilds", "GuildMessages"], "token": "MTA3MDE0NzExMjU5MzAwNjU5Mw.Gvthfa.PkPwBPKm87YYm9dEb2YBHr6TQ-v0u_WE_YPxO0", "prefix": "!" });

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