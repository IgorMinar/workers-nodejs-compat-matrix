import assert from "node:assert";
import events from "node:events";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

// One liner to kill phantom workerd processes
// ps ax | grep workerd | grep workers-nodejs-support | awk '{ print $1 }' | xargs kill

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkNodeVersion = () => {
  console.log("Checking node version");
  spawn("node", ["--version"], {
    stdio: "inherit",
  });
};

const spawnWrangler = async () => {
  console.log("Spawning wrangler");
  const port = 23457;

  const wranglerProcess = spawn(
    "node_modules/.bin/wrangler",
    ["dev", "--node-compat", `--port=${port}`, "worker.mjs"],
    {
      // stdio: ["inherit", "inherit", "inherit", "ipc"],
      stdio: ["inherit", "inherit", "inherit"],
      cwd: __dirname,
      env: { ...process.env, PWD: __dirname },
    }
  );

  const kill = async () => {
    wranglerProcess.kill("SIGTERM");
    return new Promise((res) => {
      wranglerProcess.on("close", () => res());
      wranglerProcess.on("error", () => rej());
    });
  };

  return {
    kill,
    url: new URL(`http://localhost:${port}`),
    proc: wranglerProcess,
  };
};

// Double check the node version
checkNodeVersion();

const { kill, url, proc } = await spawnWrangler();

setTimeout(async () => {
  const res = await fetch(url);
  console.log("FINISHED FETCHING");

  const filepath = path.join(__dirname, "apis-test-thing.json");
  console.log("Writing to path: ", filepath);
  await fs.writeFile(filepath, Buffer.from(await res.arrayBuffer()));

  await kill();

  console.log(proc.killed);
}, 5000);
