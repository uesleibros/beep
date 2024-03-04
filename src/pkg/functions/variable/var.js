const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");
const parseType = require("../../helpers/parseType.js");

async function var_func(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = false;

	if (args.length < 1) {
		await message.channel.send("✖ | Function `$var` needs 1 argument (2 is optional).");
		error = true;
	} else {
		if (args.length > 1) {
			options.variables[args[0]] = parseType(args[1]);
			code = code.replace(raw, '');
		} else {
			if (!(args[0] in options.variables))
				code = code.replace(raw, "undefined");
			else
				code = code.replace(raw, options.variables[args[0]]);
		}
	}

	return { code, error, options };
}

module.exports = var_func;