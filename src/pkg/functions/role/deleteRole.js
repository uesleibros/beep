const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function deleteRole(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("deleteRole", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		try {
			await message.guild.roles.delete(args[0]);
		} catch (err) {
			await CustomFunctionError("deleteRole", args, 0, message, code, raw, `Error: \`${err}\`.`);
			error = true;
		}
	}

	code = await FunctionResult(code, raw, '');
	return { code, error, options };
};

module.exports = deleteRole;