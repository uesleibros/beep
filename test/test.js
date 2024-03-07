const Client = require("../src/pkg/classes/Client.js");
require("dotenv").config();

let bot = new Client({ "token": process.env.BOT_TOKEN, "prefix": "!" });

bot.createCommand(
	"teste",
	`
		$nomention
		$jsonParse[{
		  "fruits": ["apple", "orange", "banana", "grape"\]
		}]

		Before reversing:
		> $json[fruits]

		$jsonArrayReverse[fruits]

		After reversing:
		> $json[fruits]
	`

);