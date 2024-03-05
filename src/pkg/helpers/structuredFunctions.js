const fs = require("node:fs");
const path = require("node:path");

function structuredFunctions(folder = "") {
	let functions = {};

	try {
		const functionsFolderPath = folder.length === 0 ? path.join(__dirname, "../functions") : folder;
		const items = fs.readdirSync(functionsFolderPath);

		for (const item of items) {
		   const itemPath = path.join(functionsFolderPath, item);
		   const stats = fs.statSync(itemPath);

		   if (stats.isDirectory()) {
				const subFunctions = structuredFunctions(itemPath);
				for (const functionName in subFunctions) {
					if (!functions.hasOwnProperty(functionName)) {
						functions[functionName] = subFunctions[functionName];
					}
	         }
		   } else {
				if (path.extname(item) === ".js") {
					const functionName = path.basename(item, ".js");
					functions[functionName] = functionsFolderPath;
				}
		   }
		}
	} catch (error) {
		console.error("Erro ao percorrer as pastas:", error);
	}

	return functions;
}

module.exports = structuredFunctions;