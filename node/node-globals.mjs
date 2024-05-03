/*
// source: https://nodejs.org/api/globals.html
r = await (await fetch('https://nodejs.org/api/globals.json')).json()
r.globals.map(g=>g.name.replaceAll('`', ''))
*/

export const nodeGlobals = [
    'AbortController',
    'Blob',
    'Buffer',
    'clearImmediate',
    'clearInterval',
    'clearTimeout',
    'console',
    'CustomEvent',
    'Event',
    'EventTarget',
    'File',
    'global',
    'MessageChannel',
    'MessageEvent',
    'MessagePort',
    'PerformanceEntry',
    'PerformanceMark',
    'PerformanceMeasure',
    'PerformanceObserver',
    'PerformanceObserverEntryList',
    'PerformanceResourceTiming',
    'process',
    'queueMicrotask',
    'setImmediate',
    'setInterval',
    'setTimeout',
    'structuredClone',
    'DOMException',
    'TextDecoder',
    'TextEncoder',
    'URL',
    'URLSearchParams',
    'WebAssembly'
  ]