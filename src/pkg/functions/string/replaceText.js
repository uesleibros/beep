const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

function replaceNtimes(input, searchValue, replaceValue, n) {
	let count = 0;
	return input.replace(new RegExp(searchValue, "g"), match => {
		count++;
		if (n === -1 || count <= n) {
			return replaceValue;
		} else {
			return match;
		}
	});
}

async function replaceText(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 2) {
		await message.channel.send("✖ | Function `$replaceText` needs to provide text, target, new value and replacement times (optional).");
		error = true;
	} else {
		const replaceTimes = args.length > 2 ? args[3] : 1;
		if (isNaN(replaceTimes)) {
			await message.channel.send("✖ | Function `$replaceText` replace times needs to be a number.");
			error = true;
		} else {
			code = code.replace(raw, replaceNtimes(args[0], args[1], args[2], args[3]))
		}
	}

	return { code, error, options };
}

module.exports = replaceText;