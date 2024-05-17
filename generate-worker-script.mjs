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
  const importedModules = {
    ${modules.map((moduleName) => `"${moduleName}": ${escapeIdentifier(moduleName)}`).join(",")}
  }
`;

console.log(
  `
import { visit } from "../dump-utils.mjs";
import baseline from "../node/baseline.json";

export default {
  async fetch(request, env, ctx) {

    ${code}

    const workerdGlobals = {};
    for (const module of Object.keys(baseline["*globals*"])) {
      if (typeof globalThis[module] !== "undefined") {
        workerdGlobals[module] = globalThis[module];
      }
    }

    const result = visit(baseline, {
      "*globals*": workerdGlobals,
      ...importedModules,
    });

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
`
);
