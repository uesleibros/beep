function isInteractionFunction(name) {
	return ["customID", "userInteraction"].includes(name);
}

module.exports = isInteractionFunction;