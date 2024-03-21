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
		$noMentionMessage[1]
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
	money: {
		value: 0,
		type: "boolean"
	}
});