export function visit(root, depth = 0) {
  // collect all properties of an object including inherited ones
  const entries = [];
  for (const key in root) {
    entries.push([key, root[key]]);
  }

  entries.sort(([a], [b]) => (a === "default" ? -1 : a < b ? -1 : 1));

  const visitResult = {};
  for (const [key, value] of entries) {
    const isObject =
      typeof value === "object" && value !== null && !Array.isArray(value);

    if (isObject || key === "default") {
      // don't worry drilling into exported objects beyond listing its top properties
      if (depth === 2) {
        visitResult[key] = "object";
      } else {
        const partialResult = visit(value, depth + 1);

        // if the default export is not an object, insert a special key to partialResults to indicate its type
        if (key === "default" && !isObject) {
          partialResult["*default*"] = value === null ? "null" : typeof value;
        }
        // if the partial result is an empty object serialize it as a "{}" string
        visitResult[key] =
          Object.keys(partialResult).length > 0 ? partialResult : "{}";
      }
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
  return visitResult;
}
