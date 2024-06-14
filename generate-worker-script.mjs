import baseline from "./data/baseline.json" with { type: "json" };

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

const globals = Object.keys(baseline["*globals*"]);
code += `
  const workerdGlobals = {
`;
for (const global of globals) {
  if (global === "*self*") {
    // skip synthetic synthetic *self* node
    continue;
  }

  code += `
    ${global}: globalThis.${global},
  `;
}
code += `
  };
`;

console.log(
  `
import { visit } from "../dump-utils.mjs";
import baseline from "../data/baseline.json";

export default {
  async fetch(request, env, ctx) {

    ${code}

    // delete any workerdGlobals that are undefined so that we can distinguish between undefined and missing globals
    for (const global of Object.keys(workerdGlobals)) {
      if (workerdGlobals[global] === undefined && !(global in globalThis)) {
        delete workerdGlobals[global];
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
