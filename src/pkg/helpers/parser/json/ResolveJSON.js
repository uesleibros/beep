const truncate = require("../../truncate.js");

function ResolveJSON(json) {
	const invalidValueRegex = /"([^"]+)":\s*([^,\r\n]+)\s*(?=\s*(?:,|}|$))/g;

	let match = json.match(invalidValueRegex);
	for (const keyPair of match) {
		let [key, value] = keyPair.split(":");
		value = truncate(value).trim();

		if (isNaN(value)) {
			if (value == "undefined") {
				json = json.replace(keyPair, `${key}: null`);
			} else if (["true", "false"].includes(value)) {
				json = json.replace(keyPair, `${key}: ${value === "true"}`);
			} else {
				json = json.replace(keyPair, `${key}: "${value}"`);
			}
		} else {
			json = json.replace(keyPair, `${key}: ${Number(value)}`);
		}
	}
	return json;
}

module.exports = ResolveJSON;