const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const CheckCondition = require("../../helpers/CheckCondition.js");

async function iif(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 3) {
		await message.channel.send("✖ | Function `$checkCondition` needs 3 arguments.");
		error = true;
	} else {
		const result = eval(CheckCondition.solve(args[0]))?.toString();

		if (!["true", "false"].includes(result)) {
			await message.channel.send(`✖ | Function \`$checkCondition\` is invalid, check conditional: ${args[0]}.`);
			error = true;
		}
		code = code.replace(raw, result === "true" ? args[1] : args[2]);
	}

	return { code, error, options };
}

module.exports = iif;