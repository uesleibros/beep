const parseType = require("../parseType.js");

async function FunctionError(name, argsType, argsValue, canUseWithoutArgs, message) {
	let unlimitedIndex = -1;

	const argsTypeList = argsType.map(type => {
		const [argType, prop] = type.split(':');
		return { argType, optional: prop === "op", unlimited: prop === "unlimited" };
	});

	if (!canUseWithoutArgs) {
		if (argsValue.length === 0) {
			await message.channel.send(`Function \`$${name}\` requires at least one argument.`);
			return true;
		}
	}

	if (argsType.length === 0 && !canUseWithoutArgs) {
		await message.channel.send(`Function \`$${name}\` does not accept any arguments.`);
		return true;
	}

	if (argsValue.length > 0) {
		for (let i = 0; i < argsType.length; i++) {
			if (i >= argsTypeList.length) {
				break;
			}

			const { argType, optional, unlimited } = argsTypeList[i];
			const argValue = argsValue[i];

			if (unlimited) {
				unlimitedIndex = i;
				if (await CheckUnlimited(name, argType, argsValue.slice(unlimitedIndex), message, unlimitedIndex))
					return true;
			}

			if (argValue === undefined && !optional) {
				await message.channel.send(`Argument **${i + 1}** for function \`$${name}\` is required.`);
				return true;
			}

			if (argType === "number" && isNaN(argValue)) {
				await message.channel.send(`Argument **${i + 1}** for function \`$${name}\` must be a valid number.`);
				return true;
			}

			if (argType === "boolean" && !["true", "false"].includes(parseType(argValue).toString())) {
				await message.channel.send(`Argument **${i + 1}** for function \`$${name}\` must be a boolean.`);
				return true;
			}
		}
	}

	if (unlimitedIndex > -1)
		unlimitedIndex += argsValue.length;

	if (argsValue.length > argsType.length + (unlimitedIndex < 0 ? 0 : unlimitedIndex)) {
		await message.channel.send(`Too many arguments provided for function \`$${name}\`.`);
		return true;
	}

	return false;
};

async function CheckUnlimited(name, argType, argsValue, message, startIndex) {
	for (let i = 0; i < argsValue.length; i++) {
		const argValue = argsValue[i];

		if (argType === "number") {
			if (isNaN(argValue)) {
				await message.channel.send(`Argument **${(i + 1) + startIndex}** for function \`$${name}\` must be a valid number.`);
				return true;
			}
		} else if (argType === "boolean") {
			if(!["true", "false"].includes(parseType(argValue).toString())) {
				await message.channel.send(`Argument **${i + 1}** for function \`$${name}\` must be a boolean.`);
				return true;
			}
		}
	}
	return false;
}


module.exports = FunctionError;
