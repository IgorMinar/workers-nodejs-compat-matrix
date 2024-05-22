import shell from "shelljs";
import deepmerge from "deepmerge";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { objectSort } from "./dump-utils.mjs";

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

const versionMap = {};

// Node
const nodeVersions = [18, 20, 22];
for (const version of nodeVersions) {
  shell.echo(`Generate node v${version} apis...`);
  shell.exec(volta + `run --node ${version} node node/dump.mjs`);
  shell.echo("=== Done ====================================\n\n");
}

shell.echo("Generating baseline.json");

// Create a merged baseline that will be used in the report
// as well as when generating bun and deno
const node18 = JSON.parse(shell.cat("node/node-18.json"));
const node20 = JSON.parse(shell.cat("node/node-20.json"));
const node22 = JSON.parse(shell.cat("node/node-22.json"));

// Sort the baseline by key name
const baseline = objectSort(deepmerge.all([node18, node20, node22]));

// Retain a copy of the baseline in the `node` folder for bun and deno
await fs.writeFile(
  path.join(__dirname, "node", "baseline.json"),
  JSON.stringify(baseline, null, 2)
);

// Copy to the report
shell.cp("node/baseline.json", "report/src/data");

shell.echo("=== Done ====================================\n\n");

// Re-run node against the baseline
for (const version of nodeVersions) {
  shell.echo(`Generate node v${version} apis...`);
  shell.exec(
    volta + `run --node ${version} node node/dump.mjs --compare-to-baseline`
  );
  shell.echo("=== Done ====================================\n\n");
  const versionOutput = shell
    .exec(volta + `run --node ${version} node --version`, { silent: true })
    .stdout.match(/v(?<version>\S+)/).groups.version;
  versionMap[`node${version}`] = versionOutput;
}

// Move node output to the report folder
for (const version of nodeVersions) {
  shell.mv(`node/node-${version}.json`, "report/src/data");
}

// bun
shell.echo("Generate bun apis...");
shell.exec("bun run bun/dump.js");
shell.echo("=== Done ====================================\n\n");
versionMap["bun"] = shell
  .exec(`bun --version`, { silent: true })
  .stdout.match(/(?<version>\S+)/).groups.version;

// deno
shell.echo("Generate deno apis...");
shell.exec(
  "deno run --allow-write=report/src/data/deno.json --allow-read --allow-env deno/dump.js"
);
shell.echo("=== Done ====================================\n\n");
versionMap["deno"] = shell
  .exec(`deno --version`, { silent: true })
  .stdout.match(/deno (?<version>\S+)/).groups.version;

// Workerd
shell.echo("Generate workerd + --node_compat apis...");
shell.exec("node workerd/dump.mjs");
shell.echo("=== Done ====================================\n\n");
versionMap["workerd"] = extractNpmVersion("workerd", "workerd");

// Wrangler with polyfills
shell.echo("Generate wrangler-v3 + --node_compat apis...");
shell.exec(volta + "run --node 20 node wrangler-v3-polyfills/dump.mjs");
shell.echo("=== Done ====================================\n\n");
versionMap["wranglerV3"] = extractNpmVersion(
  "wrangler-v3-polyfills",
  "wrangler"
);

shell.echo("Generate wrangler-jspm + --node_compat apis...");
shell.exec(volta + "run --node 20 node wrangler-jspm-polyfills/dump.mjs");
shell.echo("=== Done ====================================\n\n");
versionMap["wranglerJspm"] =
  "@jspm/core@" + extractNpmVersion("wrangler-jspm-polyfills", "@jspm/core");

shell.echo("Generate wrangler-unenv + --node_compat apis...");
shell.exec(volta + "run --node 20 node wrangler-unenv-polyfills/dump.mjs");
shell.echo("=== Done ====================================\n\n");
versionMap["wranglerUnenv"] =
  "unenv@" + extractNpmVersion("wrangler-unenv-polyfills", "unenv-nightly");

await fs.writeFile(
  path.join(__dirname, "report", "src", "data", "versionMap.json"),
  JSON.stringify(versionMap, null, 2)
);

const now = Date.now();
shell
  .echo(JSON.stringify({ timestamp: now }))
  .to("report/src/data/timestamp.json");

function extractNpmVersion(projectName, packageName) {
  return shell
    .exec(`pnpm --filter ./${projectName} list ${packageName} --depth=2`, {
      silent: true,
    })
    .stdout.match(`${packageName} (?<version>\\S+)`).groups.version;
}
