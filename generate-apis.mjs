import shell from "shelljs";
import deepmerge from "deepmerge";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

shell.set("-e");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!shell.env.VOLTA_HOME) {
  console.error(
    "You must have volta installed to continue. Refer to README.md for instructions."
  );
  process.exit(1);
}

if (!shell.env.BUN_INSTALL) {
  console.error(
    "You must have bun installed to continue. Refer to README.md for instructions."
  );
  process.exit(1);
}

if (!shell.which("deno")) {
  console.error(
    "You must have deno installed to continue. Refer to README.md for instructions."
  );
  process.exit(1);
}

// shelljs doesn't read from .bashrc or .zshrc which normally inject VOLTA_HOME
// into your PATH variable, so a lookup is needed.
// Trailing space is intentional, for DX
const volta = `${shell.env.VOLTA_HOME}/bin/volta `;

// Node
const nodeVersions = [18, 20, 22];
for (const version of nodeVersions) {
  shell.echo(`Generate node v${version} apis...`);
  shell.exec(volta + `run --node ${version} node node/dump.mjs`);
  shell.echo("=== Done ====================================\n\n");
}

// Create a merged baseline that will be used in the report
// as well as when generating bun and deno
const node18 = JSON.parse(shell.cat("node/node-18.json"));
const node20 = JSON.parse(shell.cat("node/node-20.json"));
const node22 = JSON.parse(shell.cat("node/node-22.json"));
const baseline = deepmerge.all([node18, node20, node22]);
await fs.writeFile(
  path.join(__dirname, "node", "baseline.json"),
  JSON.stringify(baseline, null, 2)
);
shell.cp("node/baseline.json", "report/src/data");

// Move node output to the report folder
for (const version of nodeVersions) {
  shell.mv(`node/node-${version}.json`, "report/src/data");
}

// bun
shell.echo("Generate bun apis...");
shell.exec("bun run bun/dump.js");
shell.echo("=== Done ====================================\n\n");

// deno
shell.echo("Generate deno apis...");
shell.exec("deno run --allow-write=report/src/data/deno.json deno/dump.js");
shell.echo("=== Done ====================================\n\n");

// Workerd
shell.echo("Generate workerd + --node_compat apis...");
shell.exec("node workerd/dump.mjs");
shell.echo("=== Done ====================================\n\n");

// Wrangler with polyfills
shell.echo("Generate wrangler-v3 + --node_compat apis...");
shell.exec(volta + "run --node 20 node wrangler-v3-polyfills/dump.mjs");
shell.echo("=== Done ====================================\n\n");

shell.echo("Generate wrangler-jspm + --node_compat apis...");
shell.exec(volta + "run --node 20 node wrangler-jspm-polyfills/dump.mjs");
shell.echo("=== Done ====================================\n\n");

shell.echo("Generate wrangler-unenv + --node_compat apis...");
shell.exec(volta + "run --node 20 node wrangler-unenv-polyfills/dump.mjs");
shell.echo("=== Done ====================================\n\n");
