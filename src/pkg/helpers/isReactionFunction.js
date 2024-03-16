const fs = require("node:fs");
const path = require("node:path");

function isReactionFunction(name, folder = "") {
	let isReaction = false;
	const excludeList = ["addCmdReactions", "addReactions", "onReactions"]
	const reactionFunctionsFolderPath = folder.length === 0 ? path.join(__dirname, "../functions/reactions") : folder;
	const items = fs.readdirSync(reactionFunctionsFolderPath);
	for (const item of items) {
		const itemPath = path.join(reactionFunctionsFolderPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory() && !excludeList.includes(path.basename(item, ".js"))) {
			if (!isReaction)
				isReaction = test(name, itemPath);
		} else {
			if (path.extname(item) === ".js" && !excludeList.includes(path.basename(item, ".js"))) {
				if (!isReaction)
					isReaction = path.basename(item, ".js") == name;
			}
		}
	}
	return isReaction
}

module.exports = isReactionFunction;