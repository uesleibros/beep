const getFunctionArgs = require("../getFunctionArgs.js");
const parseArgs = require("../parseArgs.js");

async function Loop(client, message, code, options, interpreter) {
   let varName;
   if (code.toLowerCase().includes("$for[")) {
      const matches = code.match(/\$for\[(.*?)\]/gi);
      if (matches) {
         for (const match of matches) {
            const args = await parseArgs(client, message, getFunctionArgs(match), options);
            varName = args[0];
            options.envVariables[varName] = 0;
            const maxCount = parseInt(args[1]);

            let loopCode = "";

            const startIndex = code.indexOf(match) + match.length;
            const endIndex = code.indexOf("$endfor", startIndex);
            if (endIndex === -1) {
               await message.channel.send("✖ | Missing `$endfor` for `$for`.");
               return;
            }
            loopCode = code.slice(startIndex, endIndex);

            for (let i = 0; i < maxCount; i++) {
               if (options.loop.break)
                  break;
               options.envVariables[varName] = i + 1;
               const iterationCode = loopCode.replace(new RegExp(`\\$\\{${varName}\\}`, "g"), i);
               await interpreter(client, message, iterationCode, options);
            }

            code = code.slice(0, startIndex - match.length) + code.slice(endIndex + 7);
         }
      }
   }
   options.loop.break = false;
   delete options.envVariables[varName];
   return code;
}


module.exports = Loop;
