export const sortFn = (a, b) => {
  if (a === "*self*") return -2;
  if (a === "default") return -1;
  return a < b ? -1 : 1;
};

export function visit(traversalNode, targetNode = traversalNode, depth = 0) {
  // create a unique object to mark keys that errored during inspection
  const INSPECTION_ERROR = {};

  // collect all properties of an object including inherited ones
  const entries = [];
  for (const key in traversalNode) {
    let value;
    try {
      value = traversalNode[key];
    } catch (e) {
      value = INSPECTION_ERROR;
    }
    entries.push([key, value]);
  }

  entries.sort(([a], [b]) => (a === "default" ? -1 : a < b ? -1 : 1));

  const visitResult = {};
  for (const [key, traversalValue] of entries) {
    let targetValue = targetNode[key];

    // If a key doesn't exist on the target node AND it's undefined, we mark it as missing.
    // For stubs, the key will not exist in the targetNode (since targetNode) but the value
    // will be `function`, since it's a proxy.
    if (!(key in targetNode) && typeof targetValue === "undefined") {
      targetValue = "missing";
    }

    if (targetValue === INSPECTION_ERROR) {
      visitResult[key] = "<INSPECTION ERROR>";
      continue;
    }

    const isObject =
      typeof traversalValue === "object" &&
      traversalValue !== null &&
      !Array.isArray(traversalValue);

    if (isObject || key === "default") {
      // don't worry drilling into exported objects beyond listing its top properties
      if (depth === 3) {
        visitResult[key] = "object";
      } else {
        const partialResult = visit(
          traversalValue,
          targetValue === "missing" ? {} : targetValue || {},
          depth + 1
        );

        partialResult["*self*"] =
          traversalValue === null ? "null" : typeof traversalValue;

        visitResult[key] = partialResult;
      }
    } else {
      // Detect unenv stubs
      if (targetValue && targetValue.__unenv__ === true) {
        visitResult[key] = "stub";
        continue;
      }

      if (typeof targetValue === "function") {
        const code = targetValue.toString();

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

      if (targetValue === "missing") {
        visitResult[key] = "missing";
      } else if (targetValue === null) {
        visitResult[key] = "null";
      } else {
        visitResult[key] = typeof targetValue;
      }
    }
  }

  return Object.keys(visitResult)
    .sort(sortFn)
    .reduce((acc, key) => ({ ...acc, [key]: visitResult[key] }), {});
}

export const objectSort = (obj) => {
  return Object.keys(obj)
    .sort(sortFn)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: typeof obj[key] === "object" ? objectSort(obj[key]) : obj[key],
      }),
      {}
    );
};
