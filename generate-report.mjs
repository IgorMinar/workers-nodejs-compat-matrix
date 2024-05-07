import shell from "shelljs";

shell.set("-e");

if (!shell.env.VOLTA_HOME) {
  console.error(
    "You must have volta installed to continue. Refer to README.md for instructions."
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

// deno
shell.echo('Generate deno apis...');
shell.exec('deno run --allow-write=report/src/data/deno.json deno/dump.js');
shell.echo('=== Done ====================================\n\n');


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
