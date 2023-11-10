import fs from "node:fs/promises";
import { builtinModules } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function visit(root, depth = 0) {
    const entries = Object.entries(root);
    entries.sort(([a], [b]) => a < b ? -1 : 1);
    const visitResult = {};
    for (const [key, value] of entries) {
        const isObject = typeof value === "object" && value !== null && !Array.isArray(value);
        const isDefaultFunction = typeof value === "function" && key === "default" && depth === 0;
        if (isObject || isDefaultFunction) {
            if (depth === 2) return;
            visitResult[key] = visit(value, depth + 1);
        } else {
            visitResult[key] = value === null ? "null" : typeof value;
        }
    }
    return visitResult;
}

const result = {};
for (const builtinModule of builtinModules) {
    const module = await import(builtinModule);
    result[builtinModule] = visit(module);
}

await fs.writeFile(path.join(__dirname, "apis.json"), JSON.stringify(result, null, 2));