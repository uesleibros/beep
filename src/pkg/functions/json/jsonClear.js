const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const ResolveJSON = require("../../helpers/parser/json/ResolveJSON");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function jsonClear(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("jsonClear", [], args, true, message);

	if (!error) {
		options.json.object = null;
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = jsonClear;