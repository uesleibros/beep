const parseType = require("../parseType.js");

function getLineAndColumn(text, line) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(line)) {
      const column = lines[i].indexOf(line) + 1;
      return [i+1, column];
    }
  }

  return [-1, -1];
}

async function FunctionError(name, argsType, argsValue, canUseWithoutArgs, code, raw, message) {
	let unlimitedIndex = -1;

	/*if (raw.charAt(raw.slice(name.length + 1)) === "[") {
		if (raw.charAt(raw.length - 1) !== "]") {
			await message.channel.send(`Function \`$${name}\` at **${functionLine}:${functionColumn + (Math.abs(raw.length - name.length))}** expected \`]\` on the end.`)
			return true;
		}
	}*/

	const argsTypeList = argsType.map(type => {
		const [argType, prop] = type.split(':');
		return { argType, optional: prop === "op", unlimited: prop === "unlimited" };
	});

	if (!canUseWithoutArgs) {
		if (argsValue?.length === 0) {
			const [functionLine, functionColumn] = getLineAndColumn(code, raw);
			await message.channel.send(`Function \`$${name}\` at **${functionLine}:${functionColumn + (name.length + 1)}** requires at least one argument.`);
			return true;
		}
	}

	/*if (argsType.length !== 0 && canUseWithoutArgs) {
		const [functionLine, functionColumn] = getLineAndColumn(code, raw);
		await message.channel.send(`Function \`$${name}\` at **${functionLine}:${functionColumn + (name.length + 1)}** does not accept any arguments.`);
		return true;
	}*/

	if (argsValue?.length > 0) {
		for (let i = 0; i < argsType.length; i++) {
			if (i >= argsTypeList.length) {
				break;
			}

			const { argType, optional, unlimited } = argsTypeList[i];
			const argValue = argsValue[i];

			if (unlimited) {
				unlimitedIndex = i;
				if (await CheckUnlimited(name, argType, argsValue.slice(unlimitedIndex), message, unlimitedIndex, code, raw))
					return true;
			}

			if (argValue === undefined && !optional) {
				const [functionLine, functionColumn] = getLineAndColumn(code, raw);
				let sumIndex = 0;

				for (const argIndex in argsValue) {
					if (argIndex < i)
						sumIndex += argsValue[argIndex].length + 1;
				}
				await message.channel.send(`Position **${i + 1}** at **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}** for function \`$${name}\` is required.`);
				return true;
			}

			if (!argValue && optional)
				continue;
			
			if (argType === "number" && isNaN(argValue)) {
				const [functionLine, functionColumn] = getLineAndColumn(code, raw);
				let sumIndex = 0;

				for (const argIndex in argsValue) {
					if (argIndex < i)
						sumIndex += argsValue[argIndex].length + 1;
				}
				await message.channel.send(`Position **${i + 1}** at **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}** for function \`$${name}\` must be a valid number, but provided: '${argsValue[i]}'.`);
				return true;
			}

			if (argType === "boolean" && !["true", "false"].includes(parseType(argValue).toString())) {
				const [functionLine, functionColumn] = getLineAndColumn(code, raw);
				let sumIndex = 0;

				for (const argIndex in argsValue) {
					if (argIndex < i)
						sumIndex += argsValue[argIndex].length + 1;
				}
				await message.channel.send(`Position **${i + 1}** at **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}** for function \`$${name}\` must be a boolean, but provided: '${argsValue[i]}'.`);
				return true;
			}
		}
	}

	if (unlimitedIndex > -1)
		unlimitedIndex += argsValue.length;

	if (argsValue?.length > argsType.length + (unlimitedIndex < 0 ? 0 : unlimitedIndex)) {
		const [functionLine, functionColumn] = getLineAndColumn(code, raw);
		let sumIndex = 0;

		for (const argIndex in argsValue) {
			if (argIndex < argsType.length)
				sumIndex += argsValue[argIndex].length + 1;
		}
		await message.channel.send(`Too many arguments provided for function \`$${name}\` at **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}**.`);
		return true;
	}

	return false;
}

async function CheckUnlimited(name, argType, argsValue, message, startIndex, code, raw) {
	for (let i = 0; i < argsValue.length; i++) {
		const argValue = argsValue[i];

		if (argType === "number") {
			if (isNaN(argValue)) {
				const [functionLine, functionColumn] = getLineAndColumn(code, raw);
				let sumIndex = 0;

				for (const argIndex in argsValue) {
					if (argIndex < i)
						sumIndex += argsValue[argIndex].length + 1;
				}
				await message.channel.send(`Position **${(i + 1) + startIndex}** at **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}** for function \`$${name}\` must be a valid number, but provided: '${argsValue[i]}'.`);
				return true;
			}
		} else if (argType === "boolean") {
			if(!["true", "false"].includes(parseType(argValue).toString())) {
				const [functionLine, functionColumn] = getLineAndColumn(code, raw);
				let sumIndex = 0;

				for (const argIndex in argsValue) {
					if (argIndex < i)
						sumIndex += argsValue[argIndex].length + 1;
				}
				await message.channel.send(`Position **${(i + 1) + startIndex}** at **${functionLine}:${functionColumn + (name.length + 1) + sumIndex}** for function \`$${name}\` must be a boolean, but provided: '${argsValue[i]}'.`);
				return true;
			}
		}
	}
	return false;
}


module.exports = FunctionError;
