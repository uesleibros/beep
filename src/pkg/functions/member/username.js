const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

const parseArgs = require("../../helpers/parseArgs.js");
async function username(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("username", ["string:op"], args, true, message);

	if (!error) {
		const userID = args[0] ? await client.users.cache.get(args[0]) : -1;
		code = await FunctionResult(code, raw, userID === -1 ? message.author.username : userID?.username);
	}
	return { code, error, options };
}

module.exports = username;