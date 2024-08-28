/**
 * Update the compatibility date to the current day in wrangler-unenv-polyfills/wrangler.toml
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "date-fns";
import { exit } from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const today = format(new Date(), "yyyy-MM-dd");

try {
  const configFile = path.join(
    __dirname,
    "wrangler-unenv-polyfills/wrangler.toml"
  );
  const config = await fs.readFile(configFile, "utf-8");
  const updatedConfigLines = [];
  let foundCompatibilityDate = false;
  for (const line of config.split("\n")) {
    if (line.startsWith("compatibility_date")) {
      foundCompatibilityDate = true;
      updatedConfigLines.push(`compatibility_date = "${today}"`);
    } else {
      updatedConfigLines.push(line);
    }
  }

  if (!foundCompatibilityDate) {
    throw new Error("Compatibility date not found in wrangler.toml");
  }

  await fs.writeFile(configFile, updatedConfigLines.join("\n"));

  console.log(`Successfully updated the compatibility date to ${today}`);
  exit(0);
} catch (e) {
  console.error("Failed to update the configuration file", e);
  exit(1);
}
