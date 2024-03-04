const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

async function argsCheck(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const messageArgsLength = message.content.length === 0 ? 0 : message.content.split(' ').length;
	let error = false;

	if (args.length < 2) {
		await message.channel.send(`✖ | Function \`$argsCheck\` needs 2 arguments, but only passed \`${args.length}\`.`);
		error = true;
	} else {
		const regex = /<=|>=|<|>|!=|==/g;
		const checks = {
			'<': messageArgsLength < Number(args[0].replace('<', '').trim()),
			'>': messageArgsLength > Number(args[0].replace('>', '').trim()),
			"<=": messageArgsLength <= Number(args[0].replace("<=", '').trim()),
			">=": messageArgsLength >= Number(args[0].replace(">=", '').trim()),
			"==": messageArgsLength == Number(args[0].replace("==", '').trim()),
			"!=": messageArgsLength !== Number(args[0].replace("!=", '').trim())
		}

		const condition = regex.exec(args[0]);
		if (condition === null) {
			await message.channel.send("✖ | First argument of function `$argsCheck` needs to be: `<value`, `>value`, `<=value`, `>=value`, `!=value`, `==value`")
			error = true;
		} else {
			if (!checks[condition[0]]) {
				await message.channel.send(args[1]);
				error = true;
			}
			code = code.replace(raw, '');
		}
	}

	return { code, error, options };
};

module.exports = argsCheck;