const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function userReaction(code, client, message, raw, options) {
	const args = getFunctionArgs(raw);
	const error = await FunctionError("userReaction", ["string:non-op"], args, false, options.originalCode, raw, message);

	if (!error) {
		const reactionUsersObject = message?.emoji && JSON.parse(JSON.stringify(message?.emoji.reaction.users)).reaction.users
		const user = await client.users.fetch(reactionUsersObject && reactionUsersObject[reactionUsersObject.length - 1]).catch(() => null);
		const getter = {
			"id": user?.id,
			"name": user?.username
		}
		code = await FunctionResult(code, raw, getter[args[0]]);
	}

	return { code, error, options };
};

module.exports = userReaction;