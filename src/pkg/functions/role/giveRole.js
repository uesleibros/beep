const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function giveRole(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("giveRole", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await message.guild.members.cache.find((m) => m.id === args[0]);

		if (!user) {
			await CustomFunctionError("giveRole", args, 0, message, code, raw, `Invalid user id: ${args[0]}`);
			error = true;
		} else {
			try {
				await user.roles.add(args[1]);
			} catch (err) {
				await CustomFunctionError("giveRole", args, 1, message, code, raw, `Error: \`${err}\`.`);
				error = true;
			}
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = giveRole;