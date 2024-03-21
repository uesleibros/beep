const FunctionError = require("../../helpers/errors/FunctionError.js");
const CustomFunctionError = require("../../helpers/errors/CustomFunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");
const parseArgs = require("../../helpers/parseArgs.js");

async function httpRequest(code, client, message, raw, options) {
	const args = await parseArgs(client, message, getFunctionArgs(raw), options);
	let error = await FunctionError("httpRequest", ["string:non-op", "string:non-op", "string:op"], args, false, options.originalCode, raw, message);

	if (!error) {
		if (!["get", "post", "put", "patch", "delete"].includes(args[0])) {
			await CustomFunctionError("httpRequest", args, 0, message, code, raw, `Invalid method type "${args[0]}". Expected (get|post|put|patch|delete).`);
			error = true;
		} else {
			let bodyData = null;
			try {
				if (args[2])
					bodyData = JSON.parse(args[2]);
			} catch (err) {
				await CustomFunctionError("httpRequest", args, 2, message, code, raw, `Invalid data value: **${err}**`);
				error = true;
			}

			try {
				options.request.object = await client.httpClient({
					method: args[0],
					url: args[1],
					headers: options.request.headers,
					data: bodyData
				});
			} catch (err) {
				options.request.object = err.response;
			}
		}
		code = await FunctionResult(code, raw, '');
	}

	return { code, error, options };
};

module.exports = httpRequest;