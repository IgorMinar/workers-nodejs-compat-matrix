import { visit } from "../dump-utils.mjs";

export default {
  async fetch(request, env, ctx) {
    let _http_agent = null;
    try {
      _http_agent = await import("_http_agent");
    } catch (err) {}

    let _http_client = null;
    try {
      _http_client = await import("_http_client");
    } catch (err) {}

    let _http_common = null;
    try {
      _http_common = await import("_http_common");
    } catch (err) {}

    let _http_incoming = null;
    try {
      _http_incoming = await import("_http_incoming");
    } catch (err) {}

    let _http_outgoing = null;
    try {
      _http_outgoing = await import("_http_outgoing");
    } catch (err) {}

    let _http_server = null;
    try {
      _http_server = await import("_http_server");
    } catch (err) {}

    let _stream_duplex = null;
    try {
      _stream_duplex = await import("_stream_duplex");
    } catch (err) {}

    let _stream_passthrough = null;
    try {
      _stream_passthrough = await import("_stream_passthrough");
    } catch (err) {}

    let _stream_readable = null;
    try {
      _stream_readable = await import("_stream_readable");
    } catch (err) {}

    let _stream_transform = null;
    try {
      _stream_transform = await import("_stream_transform");
    } catch (err) {}

    let _stream_wrap = null;
    try {
      _stream_wrap = await import("_stream_wrap");
    } catch (err) {}

    let _stream_writable = null;
    try {
      _stream_writable = await import("_stream_writable");
    } catch (err) {}

    let _tls_common = null;
    try {
      _tls_common = await import("_tls_common");
    } catch (err) {}

    let _tls_wrap = null;
    try {
      _tls_wrap = await import("_tls_wrap");
    } catch (err) {}

    let assert = null;
    try {
      assert = await import("assert");
    } catch (err) {}

    let assert_strict = null;
    try {
      assert_strict = await import("assert/strict");
    } catch (err) {}

    let async_hooks = null;
    try {
      async_hooks = await import("async_hooks");
    } catch (err) {}

    let buffer = null;
    try {
      buffer = await import("buffer");
    } catch (err) {}

    let child_process = null;
    try {
      child_process = await import("child_process");
    } catch (err) {}

    let cluster = null;
    try {
      cluster = await import("cluster");
    } catch (err) {}

    let console = null;
    try {
      console = await import("console");
    } catch (err) {}

    let constants = null;
    try {
      constants = await import("constants");
    } catch (err) {}

    let crypto = null;
    try {
      crypto = await import("crypto");
    } catch (err) {}

    let dgram = null;
    try {
      dgram = await import("dgram");
    } catch (err) {}

    let diagnostics_channel = null;
    try {
      diagnostics_channel = await import("diagnostics_channel");
    } catch (err) {}

    let dns = null;
    try {
      dns = await import("dns");
    } catch (err) {}

    let dns_promises = null;
    try {
      dns_promises = await import("dns/promises");
    } catch (err) {}

    let domain = null;
    try {
      domain = await import("domain");
    } catch (err) {}

    let events = null;
    try {
      events = await import("events");
    } catch (err) {}

    let fs = null;
    try {
      fs = await import("fs");
    } catch (err) {}

    let fs_promises = null;
    try {
      fs_promises = await import("fs/promises");
    } catch (err) {}

    let http = null;
    try {
      http = await import("http");
    } catch (err) {}

    let http2 = null;
    try {
      http2 = await import("http2");
    } catch (err) {}

    let https = null;
    try {
      https = await import("https");
    } catch (err) {}

    let inspector = null;
    try {
      inspector = await import("inspector");
    } catch (err) {}

    let inspector_promises = null;
    try {
      inspector_promises = await import("inspector/promises");
    } catch (err) {}

    let module = null;
    try {
      module = await import("module");
    } catch (err) {}

    let net = null;
    try {
      net = await import("net");
    } catch (err) {}

    let os = null;
    try {
      os = await import("os");
    } catch (err) {}

    let path = null;
    try {
      path = await import("path");
    } catch (err) {}

    let path_posix = null;
    try {
      path_posix = await import("path/posix");
    } catch (err) {}

    let path_win32 = null;
    try {
      path_win32 = await import("path/win32");
    } catch (err) {}

    let perf_hooks = null;
    try {
      perf_hooks = await import("perf_hooks");
    } catch (err) {}

    let process = null;
    try {
      process = await import("process");
    } catch (err) {}

    let punycode = null;
    try {
      punycode = await import("punycode");
    } catch (err) {}

    let querystring = null;
    try {
      querystring = await import("querystring");
    } catch (err) {}

    let readline = null;
    try {
      readline = await import("readline");
    } catch (err) {}

    let readline_promises = null;
    try {
      readline_promises = await import("readline/promises");
    } catch (err) {}

    let repl = null;
    try {
      repl = await import("repl");
    } catch (err) {}

    let stream = null;
    try {
      stream = await import("stream");
    } catch (err) {}

    let stream_consumers = null;
    try {
      stream_consumers = await import("stream/consumers");
    } catch (err) {}

    let stream_promises = null;
    try {
      stream_promises = await import("stream/promises");
    } catch (err) {}

    let stream_web = null;
    try {
      stream_web = await import("stream/web");
    } catch (err) {}

    let string_decoder = null;
    try {
      string_decoder = await import("string_decoder");
    } catch (err) {}

    let sys = null;
    try {
      sys = await import("sys");
    } catch (err) {}

    let timers = null;
    try {
      timers = await import("timers");
    } catch (err) {}

    let timers_promises = null;
    try {
      timers_promises = await import("timers/promises");
    } catch (err) {}

    let tls = null;
    try {
      tls = await import("tls");
    } catch (err) {}

    let trace_events = null;
    try {
      trace_events = await import("trace_events");
    } catch (err) {}

    let tty = null;
    try {
      tty = await import("tty");
    } catch (err) {}

    let url = null;
    try {
      url = await import("url");
    } catch (err) {}

    let util = null;
    try {
      util = await import("util");
    } catch (err) {}

    let util_types = null;
    try {
      util_types = await import("util/types");
    } catch (err) {}

    let v8 = null;
    try {
      v8 = await import("v8");
    } catch (err) {}

    let vm = null;
    try {
      vm = await import("vm");
    } catch (err) {}

    let wasi = null;
    try {
      wasi = await import("wasi");
    } catch (err) {}

    let worker_threads = null;
    try {
      worker_threads = await import("worker_threads");
    } catch (err) {}

    let zlib = null;
    try {
      zlib = await import("zlib");
    } catch (err) {}

    const modules = {
      _http_agent,
      _http_client,
      _http_common,
      _http_incoming,
      _http_outgoing,
      _http_server,
      _stream_duplex,
      _stream_passthrough,
      _stream_readable,
      _stream_transform,
      _stream_wrap,
      _stream_writable,
      _tls_common,
      _tls_wrap,
      assert,
      assert_strict,
      async_hooks,
      buffer,
      child_process,
      cluster,
      console,
      constants,
      crypto,
      dgram,
      diagnostics_channel,
      dns,
      dns_promises,
      domain,
      events,
      fs,
      fs_promises,
      http,
      http2,
      https,
      inspector,
      inspector_promises,
      module,
      net,
      os,
      path,
      path_posix,
      path_win32,
      perf_hooks,
      process,
      punycode,
      querystring,
      readline,
      readline_promises,
      repl,
      stream,
      stream_consumers,
      stream_promises,
      stream_web,
      string_decoder,
      sys,
      timers,
      timers_promises,
      tls,
      trace_events,
      tty,
      url,
      util,
      util_types,
      v8,
      vm,
      wasi,
      worker_threads,
      zlib,
    };

    const result = {};

    for (const [name, module] of Object.entries(modules)) {
      const imported = await module;
      result[name] = imported === null ? null : visit(imported);
    }

    const nodeGlobals = [
      "AbortController",
      "Blob",
      "Buffer",
      "clearImmediate",
      "clearInterval",
      "clearTimeout",
      "console",
      "CustomEvent",
      "Event",
      "EventTarget",
      "File",
      "global",
      "MessageChannel",
      "MessageEvent",
      "MessagePort",
      "PerformanceEntry",
      "PerformanceMark",
      "PerformanceMeasure",
      "PerformanceObserver",
      "PerformanceObserverEntryList",
      "PerformanceResourceTiming",
      "process",
      "queueMicrotask",
      "setImmediate",
      "setInterval",
      "setTimeout",
      "structuredClone",
      "DOMException",
      "TextDecoder",
      "TextEncoder",
      "URL",
      "URLSearchParams",
      "WebAssembly",
    ];
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
