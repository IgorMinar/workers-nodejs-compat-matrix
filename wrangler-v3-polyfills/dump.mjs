import assert from "node:assert";
import events from "node:events";
import fs from "node:fs/promises";
import childProcess from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function spawnWrangler() {
  console.log('lets go 1');
  const wranglerProcess = childProcess.spawn(
    process.execPath,
    ["node_modules/wrangler/bin/wrangler.js", "dev", "--node-compat", "--port=0", "worker.mjs"],
    {
      stdio: ["inherit", "inherit", "inherit", "ipc"],
      cwd: __dirname,
      env: { ...process.env, PWD: __dirname },
    }
  );
  console.log('lets go 2');
  const exitPromise = events.once(wranglerProcess, "exit");
  console.log('lets go 3');
  
  // TODO: this message never arrives
  // but wrangler does have code for it: https://github.com/cloudflare/workers-sdk/blob/d1909efeb0b51ca7432323cbf9333f9a85542c52/packages/wrangler/src/dev/dev.tsx#L426
  const [message] = await events.once(wranglerProcess, "message");
  console.log('lets go 4');
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