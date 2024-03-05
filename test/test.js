const Client = require("../src/pkg/classes/Client.js");
require("dotenv").config();

let bot = new Client({ "token": process.env.BOT_TOKEN, "prefix": "!" });

bot.createCommand(
	"teste",
	`
		$nomention

		$textSplit[$message; ]

		$var[Index;$splitText[$sub[$getTextSplitLength;1]]]
		$var[Value;$splitText[$getTextSplitLength]]

		$removeSplitTextElement[$getTextSplitLength]
		$removeSplitTextElement[$getTextSplitLength]

		$var[Text;$joinSplitText[ ]]

		$textSplit[$var[Text];]
		$editSplitText[$var[Index];$var[Value]]

		Original Text: $var[Text]
		New Text: $joinSplitText[]
	`
);