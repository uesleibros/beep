const EmojiParser = require("discord-emojis-parser");

async function Emoji(client, emoji) {
	const regexCustomEmoji = /<:(.*?):(\d+)>/;
	const match = emoji.match(regexCustomEmoji);

	if (match) {
		if (await client.emojis.cache.get(match[2]))
			return emoji
	} else {
		const emojiObject = EmojiParser.parse(emoji);
		if (emojiObject)
			return emojiObject[0].unicode;
	}

	return undefined;
}

module.exports = Emoji;