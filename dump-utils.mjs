function isClass(func) {
  return (
    typeof func === "function" &&
    /^class\s/.test(Function.prototype.toString.call(func))
  );
}

export function visit(root, depth = 0) {
  const entries = Object.entries(root);
  entries.sort(([a], [b]) => (a < b ? -1 : 1));
  const visitResult = {};
  for (const [key, value] of entries) {
    const isObject =
      typeof value === "object" && value !== null && !Array.isArray(value);

    if (isObject) {
      // don't worry drilling into exported objects beyond listing its top properties
      if (depth === 2) return;
      visitResult[key] = visit(value, depth + 1);
    } else {
      if (isClass(value)) {
        visitResult[key] = "class";
      } else {
        // Detect unenv stubs
        if (value && value.__unenv__ === true) {
          visitResult[key] = "stub";
          continue;
        }

        if (typeof value === "function") {
          const code = value.toString();

          // Detect unimplemented stubs
          if (
            // jspm
            code.includes("not supported by JSPM") || // https://github.com/jspm/jspm-core/blob/7af7d7413f472305d08d0d78ec3d1f15588be50a/src-browser/fs.js#L8
            code.includes("unimplemented(") || // https://github.com/jspm/jspm-core/blob/7af7d7413f472305d08d0d78ec3d1f15588be50a/src-browser/tls.js#L1
            // unenv https://github.com/unjs/unenv/blob/c6dca1dfac95bd6359e8575d4456635914823701/src/runtime/_internal/utils.ts#L30
            // deno https://github.com/denoland/deno/blob/8eb1f11112c3ced0ff4a35f3487a4da507db05c2/ext/node/polyfills/_utils.ts#L25
            code.includes("notImplemented(")
          ) {
            visitResult[key] = "stub";
            continue;
          }
        }

        visitResult[key] = value === null ? "null" : typeof value;
      }
    }
  }
  return visitResult;
}
