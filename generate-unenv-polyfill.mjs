import fs from "node:fs/promises";
import path from "node:path";
import baseline from "./node/baseline.json" with { type: "json" };

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

const exports = Object.keys(moduleInfo)
  .sort()
  .filter((key) => !["*self*", "default"].includes(key));

const generateCode = (symbolName) => {
  let type = baseline[moduleName][symbolName];
  if (typeof type === "object") {
    type = "object";
  }

  const fullName = `${moduleName}.${symbolName}`;
  switch (type) {
    case "function":
      return `export const ${symbolName}: typeof ${fullName} = notImplemented("${fullName}");\n`;
    case "string":
      return `export const ${symbolName}: typeof ${fullName} = ""; // TODO: double-check\n`;
    case "string":
      return `export const ${symbolName}: typeof ${fullName} = 0; // TODO: double-check\n`;
    case "object":
    case "class":
      return `export const ${symbolName}: typeof ${fullName} =  mock.__createMock__("${fullName}");\n`;
    default:
      return `// export const ${symbolName}: typeof ${fullName} = TODO: implement\n`;
  }
};

let code = `
import type ${moduleName} from "node:${moduleName}";
import { notImplemented } from "../../_internal/utils";
import mock from "../../mock/proxy";

`;

for (const symbol of exports) {
  code += generateCode(symbol);
}

code += `
export default <typeof ${moduleName}>{
  ${exports.join(",\n")}
}
`;

if (dest) {
  await fs.writeFile(path.resolve(dest), code);
} else {
  console.log(code);
}
