const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

function getComponentType(type) {
	if (!type)
		return undefined;

	return { 2: "button", 3: "select" }[Number(type)];
}

async function interactionInfo(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("interactionInfo", ["string:non-op", "number:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const getter = {
			"id": message?.customId,
			"type": getComponentType(message?.componentType),
			"selectedOption": message?.values && message?.values[args[1] ? Number(args[1]) - 1 : 0],
			"selectedOptions": message?.values && message.values.length
		}
		code = await FunctionResult(code, raw, getter[args[0]]);
	}

	return { code, error, options };
};

module.exports = interactionInfo;