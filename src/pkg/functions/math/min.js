const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function min(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	const numbers = [];

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$min` atleast 1 argument.");
		error = true;
	} else {
		for (const number of args) {
			if (isNaN(number)) {
				await message.channel.send(`✖ | Function \`$min\` value: ${number} needs to be a number.`);
				error = true;
			} else {
				numbers.push(Number(number));
			}
		}
		code = code.replace(raw, Math.min(...numbers));
	}
	return { code, error, options };
};

module.exports = min;