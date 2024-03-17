const Client = require("../src/pkg/classes/Client.js");
require("dotenv").config();

let bot = new Client({ "token": process.env.BOT_TOKEN, "prefix": "!" });

function GenerateFunctionTree() {
	let result = '';
	const trees = {};

	for (const name of Object.keys(bot.functions)) {
		const path = bot.functions[name].split("functions")[1].slice(1).split("\\");
		if (!(path[0] in trees)) {
			trees[path[0]] = [];
		}
		trees[path[0]].push("\\$" + name + "\n");
	}

	for (const tree of Object.keys(trees)) {
		result += trees[tree].join('');
	}

	return result;
}


bot.createCommand(
	"teste",
	true,
	`
		$addButton[no;bt1;Botão 1;primary;no;]

		$onInteraction[
			$if[$customID==bt1]
				$editButton[bt1;no;$randomString[5];primary;no;]
			$endif
		]
	`

);

bot.createCommand(
	"funcoes",
	true,
	`
		${GenerateFunctionTree()}
	`
);

bot.createCommand(
	"eval",
	true,
	`
		$argsCheck[>0;Providencie alguma coisa pra eu fazer o **$eval**.]
		$eval[$message]
	`

);

bot.createVariables({
	money: 0,
	xp: 0,
	fichas: 0,
	mamaco: 20,
	backgrounds: `
		{"backgrounds":[

		{"titulo":"Default",
		"descricao":"*Background padrão*",
		"imagem":"https://cdn.discordapp.com/attachments/1161080426312519690/1202042588744667206/22_Sem_Titulo-4.png",
		"preco":"N.A"},

		{"titulo":"Mint",
		"descricao":"*Refrescancia é o que define este background*",
		"imagem":"https://cdn.discordapp.com/attachments/1161080426312519690/1202042589969387541/22_Sem_Titulo-1.png",
		"preco":"8600"},

		{"titulo":"Attractive Red",
		"descricao":"*Um belo e atraente fundo vermelho*",
		"imagem":"https://cdn.discordapp.com/attachments/1161080426312519690/1202042589524529233/22_Sem_Titulo-2.png",
		"preco":"13200"},


		{"titulo":"Vibrations",
		"descricao":"*Vibrações estão por todos os lados, inclusive por aqui*",
		"imagem":"https://cdn.discordapp.com/attachments/1161080426312519690/1202042591194132501/22_Sem_Titulo.png",
		"preco":"24300"},

		{"titulo":"Purple Peace",
		"descricao":"*A mais pura paz na cor roxa*",
		"imagem":"https://cdn.discordapp.com/attachments/1161080426312519690/1202042589197377587/22_Sem_Titulo-3.png",
		"preco":"48000"}


		]}
	`
});