const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function max(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	const numbers = [];

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$max` atleast 1 argument.");
		error = true;
	} else {
		for (const number of args) {
			if (isNaN(number)) {
				await message.channel.send(`✖ | Function \`$max\` value: ${number} needs to be a number.`);
				error = true;
			} else {
				numbers.push(Number(number));
			}
		}
		code = code.replace(raw, Math.max(...numbers));
	}
	return { code, error, options };
};

module.exports = max;