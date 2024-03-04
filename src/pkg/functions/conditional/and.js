const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const CheckCondition = require("../../helpers/CheckCondition.js");

async function and(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let conditions = [];
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$and` needs conditional.");
		error = true;
	} else {
		for (const condition of args) {
			conditions.push(eval(CheckCondition.solve(condition)));
			if (!["true", "false"].includes(conditions[conditions.length - 1].toString())) {
				await message.channel.send(`✖ | Function \`and\` is invalid, check conditional: ${condition}.`);
				error = true;
			}
		}
		code = code.replace(raw, conditions.every(condition => condition === true));
	}

	return { code, error, options };
}

module.exports = and;