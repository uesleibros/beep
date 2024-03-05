const checkCondition = require("../../functions/conditional/checkCondition.js");

function escapeRegExp(string) {
   return string.replace(/[.*+?^${}()|[\]\\\n]/g, "\\$&");
}

async function Condition(client, message, code, options) {
	if (code.toLowerCase().includes("$if[")) {
		for (let statement of code.split(/\$if\[/gi).slice(1).reverse()) {
			const r = code.toLowerCase().split("$if[").length - 1;
			if (!code.toLowerCase().includes("$endif"))
				return await message.channel.send("✖ | Conditional `$if` not valid, missing `$endif`.");

			const everything = code.split(/\$if\[/gi)[r].split(/\$endif/gi)[0];
			statement = code.split(/\$if\[/gi)[r].split(/\$endif/gi)[0];

			let condition = statement.split("\n")[0].trim();
			condition = condition.slice(0, condition.length - 1);

			const conditionResult = await checkCondition(`$checkCondition[${condition}]`, client, message, `$checkCondition[${condition}]`, options);
			const pass = conditionResult?.code === "true";

			const elseIfAction = statement.toLowerCase().includes("$elseif");
			const elseIfs = {};

			if (elseIfAction) {
				for (const data of statement.split(/\$elseif\[/gi).slice(1)) {
					const inside = data.split(/\$elseif\[(.*?)\](.*?)\$(elseif|else|endif)/gi)[0];

					let CONDITION = inside.split("\n")[0].trim();
					CONDITION = CONDITION.slice(0, CONDITION.length - 1);
					elseIfs[CONDITION] = inside.split("\n").slice(1).join("\n");

					statement = statement.replace(new RegExp(`\\$elseif\\[${escapeRegExp(inside)}\\$(else|endif|elseif)\\1`, "mi"), "");
				}
			}

			const elseAction = statement.toLowerCase().includes("$else");
			const ifCode = elseAction ? statement.split("\n").slice(1).join("\n").split(/\$else/gi)[0] 
			: statement.split("\n").slice(1).join("\n").split(/\$endif/gi)[0];
			const elseCode = elseAction ? statement.split(/\$else/gi)[1].split(/\$endif/gi)[0] : "";

			let passes = false;
			let lastCode;

			if (elseIfAction) {
				for (const data of Object.entries(elseIfs)) {
					if (!passes) {
						const response = await checkCondition(`$checkCondition[${data[0]}]`, client, message, `$checkCondition[${data[0]}]`, options);
						if (response?.code === "true") {
							passes = true;
							lastCode = data[1];
                  }
					}
				}
			}

			code = code.replace(/\$if\[/gi, "$if[").replace(/\$endif/gi, "$endif");
			code = code.replace(`$if[${everything}$endif`, pass ? ifCode.trim() : passes ? lastCode.trim() : elseCode.trim());
		}
	}
	return code;
}

module.exports = Condition;