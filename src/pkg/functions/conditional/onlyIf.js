const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const CheckCondition = require("../../helpers/CheckCondition.js");

async function onlyIf(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 2) {
		await message.channel.send("✖ | Function `$onlyIf` needs 2 arguments.");
		error = true;
	} else {
		const result = eval(CheckCondition.solve(args[0]));

		if (!["true", "false"].includes(result.toString())) {
			await message.channel.send(`✖ | Function \`$onlyIf\` is invalid, check conditional: ${args[0]}.`);
			error = true;
		}

		if (result) {
			await message.channel.send(args[1]);
			error = true;
		} else {
			code = code.replace(raw, '');
		}
	}

	return { code, error, options };
}

module.exports = onlyIf;