import fs from "node:fs/promises";
import path from "node:path";

import { visit } from "../dump-utils.mjs";
import NODE_APIS from "../node/baseline.json" with { type: "json" };

const result = {};
for (const name of Object.keys(NODE_APIS)) {
  if (name === "*globals*") {
    const nodeGlobals = {};
    for (const globalProp of Object.keys(NODE_APIS[name])) {
      if (globalProp in globalThis) {
        nodeGlobals[globalProp] = globalThis[globalProp];
      }
    }
    result[name] = visit(nodeGlobals);

    continue;
  }

  try {
    const module = await import(`node:${name}`);
    result[name] = visit(module);
  } catch {
    continue;
  }
}

// reset process.env so that it doesn't contain user specific info
if (result["*globals*"].process?.env) {
  result["*globals*"].process.env = {};
}
if (result["process"].env) {
  result["process"].env = {};
}
if (result["process"].default?.env) {
  result["process"].default.env = {};
}
if (result["module"]._cache) {
  result["module"]._cache = {};
}

await fs.writeFile(
  path.join(__dirname, "..", "report", "src", "data", "bun.json"),
  JSON.stringify(result, null, 2)
);
