import { visit } from "../dump-utils.mjs";
import baseline from "../data/baseline.json";

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

    let test_mock_loader = null;
    try {
      test_mock_loader = await import("test/mock_loader");
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

    const importedModules = {
      _http_agent: _http_agent,
      _http_client: _http_client,
      _http_common: _http_common,
      _http_incoming: _http_incoming,
      _http_outgoing: _http_outgoing,
      _http_server: _http_server,
      _stream_duplex: _stream_duplex,
      _stream_passthrough: _stream_passthrough,
      _stream_readable: _stream_readable,
      _stream_transform: _stream_transform,
      _stream_wrap: _stream_wrap,
      _stream_writable: _stream_writable,
      _tls_common: _tls_common,
      _tls_wrap: _tls_wrap,
      assert: assert,
      "assert/strict": assert_strict,
      async_hooks: async_hooks,
      buffer: buffer,
      child_process: child_process,
      cluster: cluster,
      console: console,
      constants: constants,
      crypto: crypto,
      dgram: dgram,
      diagnostics_channel: diagnostics_channel,
      dns: dns,
      "dns/promises": dns_promises,
      domain: domain,
      events: events,
      fs: fs,
      "fs/promises": fs_promises,
      http: http,
      http2: http2,
      https: https,
      inspector: inspector,
      "inspector/promises": inspector_promises,
      module: module,
      net: net,
      os: os,
      path: path,
      "path/posix": path_posix,
      "path/win32": path_win32,
      perf_hooks: perf_hooks,
      process: process,
      punycode: punycode,
      querystring: querystring,
      readline: readline,
      "readline/promises": readline_promises,
      repl: repl,
      stream: stream,
      "stream/consumers": stream_consumers,
      "stream/promises": stream_promises,
      "stream/web": stream_web,
      string_decoder: string_decoder,
      sys: sys,
      "test/mock_loader": test_mock_loader,
      timers: timers,
      "timers/promises": timers_promises,
      tls: tls,
      trace_events: trace_events,
      tty: tty,
      url: url,
      util: util,
      "util/types": util_types,
      v8: v8,
      vm: vm,
      wasi: wasi,
      worker_threads: worker_threads,
      zlib: zlib,
    };

    const workerdGlobals = {
      AbortController: globalThis.AbortController,

      AbortSignal: globalThis.AbortSignal,

      AggregateError: globalThis.AggregateError,

      Array: globalThis.Array,

      ArrayBuffer: globalThis.ArrayBuffer,

      Atomics: globalThis.Atomics,

      BigInt: globalThis.BigInt,

      BigInt64Array: globalThis.BigInt64Array,

      BigUint64Array: globalThis.BigUint64Array,

      Blob: globalThis.Blob,

      Boolean: globalThis.Boolean,

      BroadcastChannel: globalThis.BroadcastChannel,

      Buffer: globalThis.Buffer,

      ByteLengthQueuingStrategy: globalThis.ByteLengthQueuingStrategy,

      CompressionStream: globalThis.CompressionStream,

      CountQueuingStrategy: globalThis.CountQueuingStrategy,

      Crypto: globalThis.Crypto,

      CryptoKey: globalThis.CryptoKey,

      CustomEvent: globalThis.CustomEvent,

      DOMException: globalThis.DOMException,

      DataView: globalThis.DataView,

      Date: globalThis.Date,

      DecompressionStream: globalThis.DecompressionStream,

      Error: globalThis.Error,

      EvalError: globalThis.EvalError,

      Event: globalThis.Event,

      EventTarget: globalThis.EventTarget,

      File: globalThis.File,

      FinalizationRegistry: globalThis.FinalizationRegistry,

      Float32Array: globalThis.Float32Array,

      Float64Array: globalThis.Float64Array,

      FormData: globalThis.FormData,

      Function: globalThis.Function,

      Headers: globalThis.Headers,

      Infinity: globalThis.Infinity,

      Int16Array: globalThis.Int16Array,

      Int32Array: globalThis.Int32Array,

      Int8Array: globalThis.Int8Array,

      Intl: globalThis.Intl,

      Iterator: globalThis.Iterator,

      JSON: globalThis.JSON,

      Map: globalThis.Map,

      Math: globalThis.Math,

      MessageChannel: globalThis.MessageChannel,

      MessageEvent: globalThis.MessageEvent,

      MessagePort: globalThis.MessagePort,

      NaN: globalThis.NaN,

      Navigator: globalThis.Navigator,

      Number: globalThis.Number,

      Object: globalThis.Object,

      Performance: globalThis.Performance,

      PerformanceEntry: globalThis.PerformanceEntry,

      PerformanceMark: globalThis.PerformanceMark,

      PerformanceMeasure: globalThis.PerformanceMeasure,

      PerformanceObserver: globalThis.PerformanceObserver,

      PerformanceObserverEntryList: globalThis.PerformanceObserverEntryList,

      PerformanceResourceTiming: globalThis.PerformanceResourceTiming,

      Promise: globalThis.Promise,

      Proxy: globalThis.Proxy,

      RangeError: globalThis.RangeError,

      ReadableByteStreamController: globalThis.ReadableByteStreamController,

      ReadableStream: globalThis.ReadableStream,

      ReadableStreamBYOBReader: globalThis.ReadableStreamBYOBReader,

      ReadableStreamBYOBRequest: globalThis.ReadableStreamBYOBRequest,

      ReadableStreamDefaultController:
        globalThis.ReadableStreamDefaultController,

      ReadableStreamDefaultReader: globalThis.ReadableStreamDefaultReader,

      ReferenceError: globalThis.ReferenceError,

      Reflect: globalThis.Reflect,

      RegExp: globalThis.RegExp,

      Request: globalThis.Request,

      Response: globalThis.Response,

      Set: globalThis.Set,

      SharedArrayBuffer: globalThis.SharedArrayBuffer,

      String: globalThis.String,

      SubtleCrypto: globalThis.SubtleCrypto,

      Symbol: globalThis.Symbol,

      SyntaxError: globalThis.SyntaxError,

      TextDecoder: globalThis.TextDecoder,

      TextDecoderStream: globalThis.TextDecoderStream,

      TextEncoder: globalThis.TextEncoder,

      TextEncoderStream: globalThis.TextEncoderStream,

      TransformStream: globalThis.TransformStream,

      TransformStreamDefaultController:
        globalThis.TransformStreamDefaultController,

      TypeError: globalThis.TypeError,

      URIError: globalThis.URIError,

      URL: globalThis.URL,

      URLSearchParams: globalThis.URLSearchParams,

      Uint16Array: globalThis.Uint16Array,

      Uint32Array: globalThis.Uint32Array,

      Uint8Array: globalThis.Uint8Array,

      Uint8ClampedArray: globalThis.Uint8ClampedArray,

      WeakMap: globalThis.WeakMap,

      WeakRef: globalThis.WeakRef,

      WeakSet: globalThis.WeakSet,

      WebAssembly: globalThis.WebAssembly,

      WebSocket: globalThis.WebSocket,

      WritableStream: globalThis.WritableStream,

      WritableStreamDefaultController:
        globalThis.WritableStreamDefaultController,

      WritableStreamDefaultWriter: globalThis.WritableStreamDefaultWriter,

      atob: globalThis.atob,

      btoa: globalThis.btoa,

      clearImmediate: globalThis.clearImmediate,

      clearInterval: globalThis.clearInterval,

      clearTimeout: globalThis.clearTimeout,

      console: globalThis.console,

      crypto: globalThis.crypto,

      decodeURI: globalThis.decodeURI,

      decodeURIComponent: globalThis.decodeURIComponent,

      encodeURI: globalThis.encodeURI,

      encodeURIComponent: globalThis.encodeURIComponent,

      escape: globalThis.escape,

      eval: globalThis.eval,

      fetch: globalThis.fetch,

      global: globalThis.global,

      globalThis: globalThis.globalThis,

      isFinite: globalThis.isFinite,

      isNaN: globalThis.isNaN,

      navigator: globalThis.navigator,

      parseFloat: globalThis.parseFloat,

      parseInt: globalThis.parseInt,

      performance: globalThis.performance,

      process: globalThis.process,

      queueMicrotask: globalThis.queueMicrotask,

      setImmediate: globalThis.setImmediate,

      setInterval: globalThis.setInterval,

      setTimeout: globalThis.setTimeout,

      structuredClone: globalThis.structuredClone,

      undefined: globalThis.undefined,

      unescape: globalThis.unescape,
    };

    // delete any workerdGlobals that are undefined so that we can distinguish between undefined and missing globals
    for (const global of Object.keys(workerdGlobals)) {
      if (workerdGlobals[global] === undefined && !(global in globalThis)) {
        delete workerdGlobals[global];
      }
    }

    const result = visit(baseline, {
      "*globals*": workerdGlobals,
      ...importedModules,
    });

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
