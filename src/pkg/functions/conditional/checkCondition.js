const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const CheckCondition = require("../../helpers/CheckCondition.js");

async function checkCondition(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$checkCondition` needs conditional.");
		error = true;
	} else {
		const conditional = args.join('');
		const result = eval(CheckCondition.solve(conditional))?.toString();

		if (!["true", "false"].includes(result)) {
			await message.channel.send(`✖ | Function \`$checkCondition\` is invalid, check conditional: ${conditional}.`);
			error = true;
		}
		code = code.replace(raw, result);
	}

	return { code, error, options };
}

module.exports = checkCondition;