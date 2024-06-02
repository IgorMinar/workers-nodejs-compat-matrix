import fs from "node:fs/promises";
import { builtinModules } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { visit, collectObjectProps } from "../dump-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// extract node version
const nodeMajorVersion = process.versions.node.split(".")[0];

const outputFilePath = path.join(
  __dirname,
  "..",
  "data",
  `node-${nodeMajorVersion}.json`
);
await fs.rm(outputFilePath, { force: true });

// collect all global keys
const nodeGlobalKeys = collectObjectProps(globalThis);

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

let result;
const compareToBaseline = process.argv.slice(2)[0] === "--compare-to-baseline";
if (compareToBaseline) {
  console.log("Comparing to baseline");
  const baseline = await import("../data/baseline.json", {
    with: { type: "json" },
  });
  result = visit(baseline.default, {
    "*globals*": nodeSpecificGlobals,
    ...modules,
  });
} else {
  result = visit({ "*globals*": nodeSpecificGlobals, ...modules });
}

// don't capture user-specific info in the dump
result.module._pathCache = "";
result.module._cache = "";
result.module.default._pathCache = "";
result.module.default._cache = "";

// serialize results in /data/node-<nodeVersion>.json
await fs.writeFile(outputFilePath, JSON.stringify(result, null, 2));
