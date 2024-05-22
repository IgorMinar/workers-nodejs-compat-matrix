import fs from "node:fs/promises";
import path from "node:path";
import baseline from "./data/baseline.json" with { type: "json" };

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log("ERROR: Must specify a module to generate a polyfill for");
  process.exit(1);
}

const moduleName = args[0];
const dest = args[1];

if (!dest.includes("src/unenv/src/runtime/node")) {
  console.log(dest);
  console.log("WARNING: Double check filename.");
  process.exit(1);
}

const moduleInfo = baseline[moduleName];

const escapeIdentifier = (identifier) => identifier.replace("/", "_");

const exports = Object.keys(moduleInfo)
  .sort()
  .filter((key) => !["*self*", "default"].includes(key));

const encountered = {
  function: false,
  class: false,
  object: false,
};

const generateCode = (symbolName) => {
  let type = baseline[moduleName][symbolName];
  if (typeof type === "object") {
    type = "object";
  }

  const fullName = `${escapeIdentifier(moduleName)}.${symbolName}`;
  switch (type) {
    case "function":
      encountered.function = true;
      return `export const ${symbolName}: typeof ${fullName} = notImplemented("${fullName}");\n`;
    case "string":
      return `export const ${symbolName}: typeof ${fullName} = ""; // TODO: double-check\n`;
    case "number":
      return `export const ${symbolName}: typeof ${fullName} = 0; // TODO: double-check\n`;
    case "class":
      encountered.class = true;
      return `export const ${symbolName}: typeof ${fullName} = notImplementedClass("${fullName}");\n`;
    case "object":
      encountered.object = true;
      return `export const ${symbolName}: typeof ${fullName} =  mock.__createMock__("${fullName}");\n`;
    default:
      return `// export const ${symbolName}: typeof ${fullName} = TODO: implement\n`;
  }
};

const generateImports = () => {
  let mockImports = [];

  const utilImports = [];
  if (encountered.function) {
    utilImports.push("notImplemented");
  }
  if (encountered.class) {
    utilImports.push("notImplementedClass");
  }
  if (utilImports.length > 0) {
    mockImports.push(
      `import { ${utilImports.join(", ")} } from "../../_internal/utils";`
    );
  }
  if (encountered.object) {
    mockImports.push(`import mock from "../../mock/proxy";`);
  }

  return `
${mockImports.join("\n")}
import type ${escapeIdentifier(moduleName)} from "node:${moduleName}";
  `.trim();
};

let body = ``;

for (const symbol of exports) {
  body += generateCode(symbol);
}

body += `
export default <typeof ${escapeIdentifier(moduleName)}>{
  ${exports.join(",\n")}
}
`;

const code = `
${generateImports()}

${body}
`;

if (dest) {
  await fs.writeFile(path.resolve(dest), code);
} else {
  console.log(code);
}
