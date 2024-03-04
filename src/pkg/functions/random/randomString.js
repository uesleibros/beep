const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function randomString(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$randomString` needs to provide a length.");
		error = true;
	} else {
		if (isNaN(args[0])) {
			await message.channel.send("✖ | Function `$randomString` needs to be a number.");
			error = true;
		} else {
			const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			const charactersLength = characters.length;
			let result = '';
			let counter = 0;

			while (counter < Number(args[0])) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
				counter += 1;
			}
			code = code.replace(raw, result);
		}
	}
	return { code, error, options };
};

module.exports = randomString;