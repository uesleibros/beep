function getLineAndColumn(text, line) {
	const lines = text.split("\n");
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].split("[")[0].includes(line.split("[")[0])) {
			const column = lines[i].indexOf(line) + 1;
			return [i+1, column];
		}
	}

	return [-1, -1];
}

async function CustomFunctionError(name, args, target, message, code, raw, error) {
	const [functionLine, functionColumn] = getLineAndColumn(code, raw);
	let sumIndex = 0;
	for (const argIndex in args) {
		if (argIndex < target)
			sumIndex += args[argIndex].length + 1;
	}

	if (target < 0)
		await message.channel.send(`At **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}** for function \`$${name}\`. ${error}`);
	else
		await message.channel.send(`Position **${target + 1}** at **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}** for function \`$${name}\`. ${error}`);
	return;
}

module.exports = CustomFunctionError;