import assert from "node:assert";
import events from "node:events";
import fs from "node:fs/promises";
import childProcess from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function spawnWrangler() {
  const wranglerProcess = childProcess.spawn(
    process.execPath,
    ["node_modules/.bin/wrangler", "dev", "--node-compat", "--port=0", "worker.mjs"],
    {
      stdio: ["inherit", "inherit", "inherit", "ipc"],
      cwd: __dirname,
      env: { ...process.env, PWD: __dirname },
    }
  );
  const exitPromise = events.once(wranglerProcess, "exit");
  const [message] = await events.once(wranglerProcess, "message");
  wranglerProcess.disconnect();
  const { event, ip, port } = JSON.parse(message);
  assert.strictEqual(event, "DEV_SERVER_READY");
  const url = new URL(`http://${ip}:${port}`);
  return {
    url,
    async kill() {
      wranglerProcess.kill("SIGKILL");
      await exitPromise;
    }
  };
}

const { url, kill } = await spawnWrangler();
const res = await fetch(url);
await kill();

await fs.writeFile(path.join(__dirname, "apis.json"), Buffer.from(await res.arrayBuffer()));