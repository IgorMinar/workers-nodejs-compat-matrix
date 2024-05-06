import { nodeGlobals } from "./node/node-globals.mjs";

let code = "";

const modules = [
  "_http_agent",
  "_http_client",
  "_http_common",
  "_http_incoming",
  "_http_outgoing",
  "_http_server",
  "_stream_duplex",
  "_stream_passthrough",
  "_stream_readable",
  "_stream_transform",
  "_stream_wrap",
  "_stream_writable",
  "_tls_common",
  "_tls_wrap",
  "assert",
  "assert/strict",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "dns/promises",
  "domain",
  "events",
  "fs",
  "fs/promises",
  "http",
  "http2",
  "https",
  "inspector",
  "inspector/promises",
  "module",
  "net",
  "os",
  "path",
  "path/posix",
  "path/win32",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "readline/promises",
  "repl",
  "stream",
  "stream/consumers",
  "stream/promises",
  "stream/web",
  "string_decoder",
  "sys",
  "timers",
  "timers/promises",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "util/types",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib",
];

const escapeIdentifier = (name) => name.replace("/", "_");

for (const moduleName of modules) {
  code += `
    let ${escapeIdentifier(moduleName)} = null;
    try {
      ${escapeIdentifier(moduleName)} = await import("${moduleName}");
    } catch (err) {}
  `;
}

code += `
  const modules = {
    ${modules.map((m) => escapeIdentifier(m)).join(",")}
  }
`;

console.log(
  `
import { visit } from "../dump-utils.mjs";

export default {
  async fetch(request, env, ctx) {

    ${code}

    const result = {};

    for (const [name, module] of Object.entries(modules)) {
      const imported = await module;
      result[name] = imported === null ? null : visit(imported);
    }

    const nodeGlobals = [${nodeGlobals.map((m) => `"${m}"`).join(",")}];
    const globalsMap = {};
    for (const module of nodeGlobals) {
      if (typeof globalThis[module] !== "undefined") {
        globalsMap[module] = globalThis[module];
      }
    }
    result["*globals*"] = visit(globalsMap);

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
`
);
