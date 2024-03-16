const fs = require("node:fs");
const path = require("node:path");

function isInteractionFunction(name, folder = "") {
	let isInteraction = false;
	const excludeList = ["components", "onInteraction", "removeComponents"]
	const interactionFunctionsFolderPath = folder.length === 0 ? path.join(__dirname, "../functions/interactions") : folder;
	const items = fs.readdirSync(interactionFunctionsFolderPath);
	for (const item of items) {
		const itemPath = path.join(interactionFunctionsFolderPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory() && !excludeList.includes(path.basename(item, ".js"))) {
			if (!isInteraction)
				isInteraction = test(name, itemPath);
		} else {
			if (path.extname(item) === ".js" && !excludeList.includes(path.basename(item, ".js"))) {
				if (!isInteraction)
					isInteraction = path.basename(item, ".js") == name;
			}
		}
	}
	return isInteraction
}

module.exports = isInteractionFunction;