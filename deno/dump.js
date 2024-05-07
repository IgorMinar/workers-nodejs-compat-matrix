import { visit } from "../dump-utils.mjs";
import NODE_APIS from "../node/apis.json"  with { type: "json" };
import path from "node:path";

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

await Deno.writeTextFile(path.join(import.meta.dirname, "..", "report", "src", "data", "deno.json"), JSON.stringify(result, null, 2));

