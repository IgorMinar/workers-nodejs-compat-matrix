import fs from "node:fs/promises";
import { builtinModules } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { visit } from "../dump-utils.mjs";
import baseline from "../node/baseline.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// collect all global keys
const nodeGlobalKeys = Object.keys(
  Object.getOwnPropertyDescriptors(globalThis)
).sort();

// iterates over node globals and creates an object with global
// name as the key, and global itself as the value
const nodeSpecificGlobals = nodeGlobalKeys.reduce((map, g) => {
  if (g in globalThis) {
    map[g] = globalThis[g];
  }
  return map;
}, {});

// don't capture user-specific info in the dump
nodeSpecificGlobals.process.env = {};

const modules = {};
for (const builtinModule of builtinModules) {
  const module = await import(builtinModule);
  modules[builtinModule] = module;
}

const compareToBaseline = process.argv.slice(2)[0] === "--compare-to-baseline";
if (compareToBaseline) {
  console.log("Generating against baseline");
}
const result = compareToBaseline
  ? visit(baseline, { "*globals*": nodeSpecificGlobals, ...modules })
  : visit({ "*globals*": nodeSpecificGlobals, ...modules });

// don't capture user-specific info in the dump
result.module._pathCache = "";
result.module._cache = "";
result.module.default._pathCache = "";
result.module.default._cache = "";

// extract node version
const nodeMajorVersion = process.versions.node.split(".")[0];

// serialize results in apis-<nodeVersion>.json
await fs.writeFile(
  path.join(__dirname, `node-${nodeMajorVersion}.json`),
  JSON.stringify(result, null, 2)
);
