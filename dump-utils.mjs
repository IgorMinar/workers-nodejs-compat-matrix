function isClass(func) {
    return typeof func === 'function' 
        && /^class\s/.test(Function.prototype.toString.call(func));
}

export function visit(root, depth = 0) {
    const entries = Object.entries(root);
    entries.sort(([a], [b]) => a < b ? -1 : 1);
    const visitResult = {};
    for (const [key, value] of entries) {
        const isObject = typeof value === "object" && value !== null && !Array.isArray(value);
        const isDefaultFunction = typeof value === "function" && key === "default" && depth === 0;
        const isDefaultExport = isObject && key === "default" && depth === 0;
        
        // filter out the default exports and the default function
        if (isDefaultFunction || isDefaultExport) continue;

        if (isObject) {
            // don't worry drilling into exported objects beyond listing its top properties
            if (depth === 2) return;
            visitResult[key] = visit(value, depth + 1);
        } else {
            if (isClass(value)) {
                visitResult[key] = "class";
            } else {
                visitResult[key] = value === null ? "null" : typeof value;
            }
        }
    }
    return visitResult;
}