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
		trees[path[0]].push('- '.repeat(2) + name + "\n");
	}

	for (const tree of Object.keys(trees)) {
		result += "- **" + tree.toUpperCase() + "**\n" + trees[tree].join('');
	}

	return result;
}

bot.createCommand(
	"teste",
	true,
	`
		$addButton[no;bt1;Botão 1;primary;no;]

		$onInteractionButton[
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
)

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
	fichas: 0
});