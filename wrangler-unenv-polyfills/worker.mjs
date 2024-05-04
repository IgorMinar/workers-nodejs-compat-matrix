import { visit } from "../dump-utils.mjs";

// Required for HTTP polyfill to import
// globalThis.XMLHttpRequest = class {
//   open() {}
//   get responseType() {}
// };
// globalThis.location = {};

export default {
  async fetch(request, env, ctx) {
    const _http_agent = null; // await import("_http_agent");
    const _http_client = null; // await import("_http_client");
    const _http_common = null; // await import("_http_common");
    const _http_incoming = null; // await import("_http_incoming");
    const _http_outgoing = null; // await import("_http_outgoing");
    const _http_server = null; // await import("_http_server");
    const _stream_duplex = await import("_stream_duplex");
    const _stream_passthrough = await import("_stream_passthrough");
    const _stream_readable = await import("_stream_readable");
    const _stream_transform = await import("_stream_transform");
    const _stream_wrap = null; // await import("_stream_wrap");
    const _stream_writable = await import("_stream_writable");
    const _tls_common = null; // await import("_tls_common");
    const _tls_wrap = null; // await import("_tls_wrap");
    const assert = await import("assert");
    const assertStrict = null; // await import("assert/strict");
    const async_hooks = null; // await import("async_hooks");
    const buffer = await import("buffer");
    const child_process = await import("child_process");
    const cluster = await import("cluster");
    const console = await import("console");
    const constants = await import("constants");
    const crypto = await import("crypto");
    const dgram = await import("dgram");
    const diagnostics_channel = null; // await import("diagnostics_channel");
    const dns = await import("dns");
    const dnsPromises = null; // await import("dns/promises");
    const domain = await import("domain");
    const events = await import("events");
    const fs = await import("fs");
    const fsPromises = null; // await import("fs/promises");
    const http = null; // await import("http"); (REQUIRES XHR)
    const http2 = null; // await import("http2");
    const https = null; // await import("https"); (REQUIRES XHR)
    const inspector = null; // await import("inspector");
    const inspectorPromises = null; // await import("inspector/promises");
    const module = await import("module");
    const net = await import("net");
    const os = await import("os");
    const path = await import("path");
    const pathPosix = null; // await import("path/posix");
    const pathWin32 = null; // await import("path/win32");
    const perf_hooks = null; // await import("perf_hooks");
    const process = await import("process");
    const punycode = await import("punycode");
    const querystring = await import("querystring");
    const readline = await import("readline");
    const readlinePromises = null; // await import("readline/promises");
    const repl = await import("repl");
    const stream = await import("stream");
    const streamConsumers = null; // await import("stream/consumers");
    const streamPromises = null; // await import("stream/promises");
    const streamWeb = null; // await import("stream/web");
    const string_decoder = await import("string_decoder");
    const sys = await import("sys");
    const timers = await import("timers");
    const timersPromises = null; // await import("timers/promises");
    const tls = await import("tls");
    const trace_events = null; // await import("trace_events");
    const tty = null; // await import("tty"); (NOT IMPLEMENTED)
    const url = await import("url");
    const util = await import("util");
    const utilTypes = null; // await import("util/types");
    const v8 = null; // await import("v8");
    const vm = null; // await import("vm"); (REQUIRES DOM)
    const wasi = null; // await import("wasi");
    const worker_threads = null; // await import("worker_threads");
    const zlib = await import("zlib");

    const modules = [
      ["_http_agent", _http_agent],
      ["_http_client", _http_client],
      ["_http_common", _http_common],
      ["_http_incoming", _http_incoming],
      ["_http_outgoing", _http_outgoing],
      ["_http_server", _http_server],
      ["_stream_duplex", _stream_duplex],
      ["_stream_passthrough", _stream_passthrough],
      ["_stream_readable", _stream_readable],
      ["_stream_transform", _stream_transform],
      ["_stream_wrap", _stream_wrap],
      ["_stream_writable", _stream_writable],
      ["_tls_common", _tls_common],
      ["_tls_wrap", _tls_wrap],
      ["assert", assert],
      ["assert/strict", assertStrict],
      ["async_hooks", async_hooks],
      ["buffer", buffer],
      ["child_process", child_process],
      ["cluster", cluster],
      ["console", console],
      ["constants", constants],
      ["crypto", crypto],
      ["dgram", dgram],
      ["diagnostics_channel", diagnostics_channel],
      ["dns", dns],
      ["dns/promises", dnsPromises],
      ["domain", domain],
      ["events", events],
      ["fs", fs],
      ["fs/promises", fsPromises],
      ["http", http],
      ["http2", http2],
      ["https", https],
      ["inspector", inspector],
      ["inspector/promises", inspectorPromises],
      ["module", module],
      ["net", net],
      ["os", os],
      ["path", path],
      ["path/posix", pathPosix],
      ["path/win32", pathWin32],
      ["perf_hooks", perf_hooks],
      ["process", process],
      ["punycode", punycode],
      ["querystring", querystring],
      ["readline", readline],
      ["readline/promises", readlinePromises],
      ["repl", repl],
      ["stream", stream],
      ["stream/consumers", streamConsumers],
      ["stream/promises", streamPromises],
      ["stream/web", streamWeb],
      ["string_decoder", string_decoder],
      ["sys", sys],
      ["timers", timers],
      ["timers/promises", timersPromises],
      ["tls", tls],
      ["trace_events", trace_events],
      ["tty", tty],
      ["url", url],
      ["util", util],
      ["util/types", utilTypes],
      ["v8", v8],
      ["vm", vm],
      ["wasi", wasi],
      ["worker_threads", worker_threads],
      ["zlib", zlib],
    ];

    const result = {};
    for (const [name, module] of modules) {
      if (module === null) {
        result[name] = null;
      } else {
        result[name] = visit(module);
      }
    }

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
