const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function roleGrant(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("roleGrant", ["string:non-op", "string:unlimited"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await message.guild.members.cache.find((m) => m.id === args[0]);

		if (!user) {
			await CustomFunctionError("roleGrant", args, 0, message, code, raw, `Invalid user id: ${args[0]}`);
			error = true;
		} else {
			let argsSpliced = args.toSpliced(0, 1);
			for (let argIndex = 0; argIndex < argsSpliced.length; argIndex++) {
				if (!["+", "-"].includes(argsSpliced[argIndex].charAt(0))) {
					await CustomFunctionError("roleGrant", args, argIndex + 1, message, code, raw, `Missing (+/-) on starting of role id: \`${argsSpliced[argIndex]}\`.`);
					error = true;
				} else {
					try {
						if (argsSpliced[argIndex].charAt(0) === "+")
							await user.roles.add(argsSpliced[argIndex].slice(1));
						else
							await user.roles.remove(argsSpliced[argIndex].slice(1));
					} catch (err) {
						await CustomFunctionError("roleGrant", args, argIndex + 1, message, code, raw, `Error: \`${err}\`.`);
						error = true;
					}
				}
			}
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = roleGrant;