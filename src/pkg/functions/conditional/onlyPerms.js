const { PermissionsBitField } = require("discord.js");
const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function onlyPerms(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("onlyPerms", ["string:non-op", "string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		let hasPermission;

		try {
			hasPermission = message.member.permissions.has(PermissionsBitField.Flags[args[0]]);
			if (!hasPermission) {
				await message.channel.send(args[1]);
				error = true;
			}
		} catch (_) {
			await CustomFunctionError("onlyPerms", args, 0, message, code, raw, `Invalid permission field: \`${args[0]}\`.`);
			error = true;
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = onlyPerms;