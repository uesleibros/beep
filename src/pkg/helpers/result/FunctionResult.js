async function FunctionResult(code, raw, result) {
	return code.replace(raw, result);
};

module.exports = FunctionResult;