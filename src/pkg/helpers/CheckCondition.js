class CheckCondition {
    static solve(msg) {
        return this.solveExpression(msg);
    }

    static solveExpression(expression) {
        return expression
            .replace(/\(([^()]*)\)/g, (_, exp) => this.solveExpression(exp))
            .replace(/([^()]+)\s*(==|!=|>=?|<=?|\|\||&&)\s*([^()]+)/g, (_, left, operator, right) =>
                this.solveOperation(left.trim(), operator.trim(), right.trim())
            );
    }

    static solveOperation(left, operator, right) {
        left = isNaN(left) ? `[${left}]` : Number(left);
        right = isNaN(right) ? `[${right}]` : Number(right);

        switch (operator) {
            case "==": return left === right;
            case "!=": return left !== right;
            case '>': return left > right;
            case '<': return left < right;
            case ">=": return left >= right;
            case "<=": return left <= right;
            case "&&": return left && right;
            case "||": return left || right;
            default: return false;
        }
    }
}

module.exports = CheckCondition;
