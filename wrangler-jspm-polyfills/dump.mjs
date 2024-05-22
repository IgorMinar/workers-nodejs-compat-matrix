import assert from "node:assert";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

// One liner to kill phantom workerd processes
// ps ax | grep workerd | grep workers-nodejs-support | awk '{ print $1 }' | xargs kill

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spawnWrangler = async () => {
  const wranglerProcess = spawn(
    "node_modules/.bin/wrangler",
    ["dev", "--node-compat", `--port=0`, "worker.mjs"],
    {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
      cwd: __dirname,
      env: { ...process.env, PWD: __dirname },
    }
  );

  wranglerProcess.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
  });

  wranglerProcess.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  const url = await new Promise((res) => {
    wranglerProcess.on("message", (message) => {
      const { event, ip, port } = JSON.parse(message);
      assert.strictEqual(event, "DEV_SERVER_READY");
      res(new URL(`http://${ip}:${port}`));
    });
  });

  const kill = async () => {
    wranglerProcess.kill("SIGTERM");
    return new Promise((res) => {
      wranglerProcess.on("close", () => res());
      wranglerProcess.on("error", () => rej());
    });
  };

  return {
    kill,
    url,
  };
};

const dump = async () => {
  // Spawn wrangler
  console.log("Spawning wrangler");
  const { kill, url } = await spawnWrangler();

  // Make request to test worker
  console.log("Fetching from test worker");
  const res = await fetch(url);

  // Write results to file
  const filepath = path.join(
    __dirname,
    "..",
    "data",
    "wrangler-jspm-polyfills.json"
  );
  await fs.writeFile(filepath, Buffer.from(await res.arrayBuffer()));
  console.log("Done! Result written to", path.relative(__dirname, filepath));
  await kill();
};

await dump();
