import fs from "node:fs/promises";
import { builtinModules } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nodeGlobals } from "./node-globals.mjs";
import { visit } from "../dump-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = {};

// iterates over node globals and creates an object with global
// name as the key, and global itself as the value
const nodeSpecificGlobals = nodeGlobals.reduce((map, g) => {
    if (g in globalThis) {
        map[g] = globalThis[g];
    }
    return map
}, {});

// don't capture user-specific info in the dump
nodeSpecificGlobals.process.env = {};

result['*globals*'] = visit(nodeSpecificGlobals);

for (const builtinModule of builtinModules) {
    // TODO: determine if we care about internal modules that start with _
    //if (builtinModule.startsWith('_')) continue;

    const module = await import(builtinModule);
    result[builtinModule] = visit(module);
}

// don't capture user-specific info in the dump
result.module._pathCache = '';

// extract node version
const nodeMajorVersion = process.versions.node.split('.')[0];

// serialize results in apis-<nodeVersion>.json
await fs.writeFile(path.join(__dirname, '..', 'report', 'src', 'data', `node-${nodeMajorVersion}.json`), JSON.stringify(result, null, 2));