import fs from "node:fs/promises";
import path from "node:path";

import { visit } from "../dump-utils.mjs";
import baseline from "../node/baseline.json" with { type: "json" };

const denoGlobals = {};
const importedModules = {};
for (const name of Object.keys(baseline)) {
  if (name === "*globals*") {
    for (const globalProp of Object.keys(baseline["*globals*"])) {
      if (globalProp in globalThis) {
        denoGlobals[globalProp] = globalThis[globalProp];
      }
    }
    continue;
  }

  try {
    const module = await import(`node:${name}`);
    importedModules[name] = module;
  } catch {
    continue;
  }
}

const result = visit(baseline, {
  "*globals*": denoGlobals,
  ...importedModules,
});

await fs.writeFile(
  path.join(import.meta.dirname, "..", "report", "src", "data", "deno.json"),
  JSON.stringify(result, null, 2)
);
