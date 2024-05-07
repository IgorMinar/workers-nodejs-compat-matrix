import { nodeGlobals } from "./node/node-globals.mjs";
import baseline from "./node/baseline.json" with { type: "json" };

let code = "";

const escapeIdentifier = (name) => name.replace("/", "_");

const modules = Object.keys(baseline).filter((k) => k !== "*globals*");
for (const moduleName of modules) {
  code += `
    let ${escapeIdentifier(moduleName)} = null;
    try {
      ${escapeIdentifier(moduleName)} = await import("${moduleName}");
    } catch (err) {}
  `;
}

code += `
  const modules = {
    ${modules.map((moduleName) => `"${moduleName}": ${escapeIdentifier(moduleName)}`).join(",")}
  }
`;

console.log(
  `
import { visit } from "../dump-utils.mjs";

export default {
  async fetch(request, env, ctx) {

    ${code}

    const result = {};

    for (const [name, module] of Object.entries(modules)) {
      const imported = await module;
      result[name] = imported === null ? null : visit(imported);
    }

    const nodeGlobals = [${nodeGlobals.map((m) => `"${m}"`).join(",")}];
    const globalsMap = {};
    for (const module of nodeGlobals) {
      if (typeof globalThis[module] !== "undefined") {
        globalsMap[module] = globalThis[module];
      }
    }
    result["*globals*"] = visit(globalsMap);

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
`
);
