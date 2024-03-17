const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function createRole(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("createRole", ["string:non-op", "string:non-op", "boolean:non-op", "boolean:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		try {
			await message.guild.roles.create({
				name: args[0],
				color: parseInt(args[1].replace(/^#/, ''), 16),
				hoist: parseType(args[2]),
				mentionable: parseType(args[3])
			});
		} catch (err) {
			await CustomFunctionError("createRole", args, -1, message, code, raw, `Error: \`${err}\`.`);
			error = true;
		}
	}

	code = await FunctionResult(code, raw, '');
	return { code, error, options };
};

module.exports = createRole;