import shell from "shelljs";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

shell.set("-e");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportedEnvironments = [
  "node",
  "bun",
  "deno",
  "workerd",
  "wrangler-v3",
  "wrangler-jspm",
  "wrangler-unenv",
];

// args check
if (
  !(
    process.argv.length === 2 ||
    (process.argv.length === 4 &&
      process.argv[2] === "--only" &&
      process.argv[3]
        .split(",")
        .every((env) => supportedEnvironments.includes(env)))
  )
) {
  console.error(`
  Error: Incorrect arguments!

  ${process.argv.length} ${process.argv[2]} ${process.argv[3]}

  This script can be called with --only option followed by comma separated list of environments to scan.

  Examples:
    --only wrangler-unenv
    --only workerd,wrangler-unenv

  Supported environments: node, bun, deno, workerd, wrangler-v3, wrangler-jspm, and wrangler-unenv
  `);
  process.exit(1);
}

const regenerateEnvs =
  process.argv.length === 4
    ? process.argv[3].split(",")
    : supportedEnvironments;

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

// Compare node versions to the baseline
if (regenerateEnvs.includes("node")) {
  const nodeVersions = [18, 20, 22];
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
    shell.mv(`node/node-${version}.json`, "./data");
  }
}

// bun
if (regenerateEnvs.includes("bun")) {
  shell.echo("Generate bun apis...");
  shell.exec("bun run bun/dump.js");
  shell.echo("=== Done ====================================\n\n");
  versionMap["bun"] = shell
    .exec(`bun --version`, { silent: true })
    .stdout.match(/(?<version>\S+)/).groups.version;
}

// deno
if (regenerateEnvs.includes("deno")) {
  shell.echo("Generate deno apis...");
  shell.exec(
    "deno run --allow-write=./data/deno.json --allow-read --allow-env deno/dump.js"
  );
  shell.echo("=== Done ====================================\n\n");
  versionMap["deno"] = shell
    .exec(`deno --version`, { silent: true })
    .stdout.match(/deno (?<version>\S+)/).groups.version;
}

// workerd
if (regenerateEnvs.includes("workerd")) {
  shell.echo("Generate workerd + --node_compat apis...");
  shell.exec("node workerd/dump.mjs");
  shell.echo("=== Done ====================================\n\n");
  versionMap["workerd"] = extractNpmVersion("workerd", "workerd");
}

// wrangler-v3 (with polyfills)
if (regenerateEnvs.includes("wrangler-v3")) {
  shell.echo("Generate wrangler-v3 + --node_compat apis...");
  shell.exec(volta + "run --node 20 node wrangler-v3-polyfills/dump.mjs");
  shell.echo("=== Done ====================================\n\n");
  versionMap["wranglerV3"] = extractNpmVersion(
    "wrangler-v3-polyfills",
    "wrangler"
  );
}

// wrangler-jspm
if (regenerateEnvs.includes("wrangler-jspm")) {
  shell.echo("Generate wrangler-jspm + --node_compat apis...");
  shell.exec(volta + "run --node 20 node wrangler-jspm-polyfills/dump.mjs");
  shell.echo("=== Done ====================================\n\n");
  versionMap["wranglerJspm"] =
    "@jspm/core@" + extractNpmVersion("wrangler-jspm-polyfills", "@jspm/core");
}

// wrangler-unenv
if (regenerateEnvs.includes("wrangler-unenv")) {
  shell.echo("Generate wrangler-unenv + --node_compat apis...");
  shell.exec(volta + "run --node 20 node wrangler-unenv-polyfills/dump.mjs");
  shell.echo("=== Done ====================================\n\n");
  versionMap["wranglerUnenv"] =
    "unenv@" + extractNpmVersion("wrangler-unenv-polyfills", "unenv-nightly");
}

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
