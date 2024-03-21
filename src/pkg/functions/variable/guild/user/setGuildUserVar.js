const FunctionError = require("../../../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../../../helpers/getFunctionArgs.js");
const parseArgs = require("../../../../helpers/parseArgs.js");
const parseType = require("../../../../helpers/parseType.js");

async function setGuildUserVar(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("setGuildUserVar", ["string:non-op", "string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const user = await client.users.fetch(args[2] || message.author.id).catch(() => null);
		if (!user) {
			await CustomFunctionError("setGuildUserVar", args, 2, message, code, raw, `Provided invalid user id: "${args[2]}"`);
			error = true;
		} else {
			const isValid = await client.database.setTableValue("userGuildTable", { value: args[1], variableName: args[0], guildId: message.guildId, id: user.id });

			switch (isValid) {
				case "undefined":
					await CustomFunctionError("setGuildUserVar", args, 0, message, code, raw, `Variable "${args[0]}" is not defined.`);
					error = true;
					break; 
				case "invalid-format":
					await CustomFunctionError("setGuildUserVar", args, 1, message, code, raw, `The value doesn't match with type of variable "${args[0]}", only accept "${client.variables[args[0]].type}" type.`);
					error = true;
					break;
			}
			code = await FunctionResult(code, raw, '');
		}
	}

	return { code, error, options };
}

module.exports = setGuildUserVar;