const fs = require("node:fs");
const path = require("node:path");

function structuredFunctions() {
	const functions = {};

	try {
		const functionsFolderPath = path.join(__dirname, "../functions");
		const items = fs.readdirSync(functionsFolderPath);

		for (const item of items) {
		   const itemPath = path.join(functionsFolderPath, item);
		   const stats = fs.statSync(itemPath);

		   if (stats.isDirectory()) {
				const files = fs.readdirSync(itemPath);
				for (const file of files) {
					if (path.extname(file) === ".js") {
						const functionName = path.basename(file, ".js");
						functions[functionName] = itemPath;
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