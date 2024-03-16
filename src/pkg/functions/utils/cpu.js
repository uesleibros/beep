const os = require("os"); 
const FunctionError = require("../../helpers/errors/FunctionError.js");
const FunctionResult = require("../../helpers/result/FunctionResult.js");
const getFunctionArgs = require("../../helpers/getFunctionArgs.js");

function calculateOverallCpuUsage(cpuInfo) {
	let totalCpuTime = 0;
	let totalIdleTime = 0;

	cpuInfo.forEach(cpu => {
	  totalCpuTime += cpu.times.user + cpu.times.nice + cpu.times.sys;
	  totalIdleTime += cpu.times.idle;
	});

	const overallCpuUsagePercentage = (totalCpuTime / (totalCpuTime + totalIdleTime)) * 100;
	return overallCpuUsagePercentage.toFixed(2);
}

async function cpu(code, client, message, raw, options) {
	const args = getFunctionArgs(raw)
	const error = await FunctionError("cpu", [], args, true, options.originalCode, raw, message);

	if (!error)
		code = await FunctionResult(code, raw, calculateOverallCpuUsage(os.cpus()));

	return { code, error, options };
};

module.exports = cpu;