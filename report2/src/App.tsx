import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import node18 from "./data/node-18.json";
import node20 from "./data/node-20.json";
import workerd from "./data/workerd.json";
import wranglerJspm from "./data/wrangler-jspm.json";
import wranglerUnenv from "./data/wrangler-unenv.json";
import wranglerV3 from "./data/wrangler-v3.json";
import node22 from "./data/node-22.json";

// const baseline = node22;

type CompatObject = Record<string, string>;
type CompatMap = Record<string, string | CompatObject>;

const irrelevantAPIs = [
  "child_process",
  "cluster",
  "constants",
  "domain",
  "inspector",
  "inspector/promises",
  "module",
  "os",
  "path/win32",
  "process",
  "repl",
  "sys",
  "trace_events",
  "tty",
  "vm",
  "worker_threads",
];

const supported = "✅";
const unsupported = "❌";

// const relevantAPIs = Object.keys(baseline)
//   .filter((name) => !irrelevantAPIs.includes(name))
//   .sort()
//   .reduce((acc, key) => {
//     return {
//       ...acc,
//       [key]: baseline[key as keyof typeof baseline],
//     };
//   }, {});

// const isObject = (nodeValue: any) =>
// typeof nodeValue === "object" && Object.keys(nodeValue).length > 0;

const isObject = (nodeValue: any) =>
  nodeValue &&
  typeof nodeValue === "object" &&
  Object.keys(nodeValue).length > 0;

function App() {
  const getTargetValue: any = (map: CompatMap, path: string[]) => {
    if (path.length === 0) {
      return map;
    }
    const [head, ...tail] = path;
    const value = map[head];
    if (value == null || value === undefined) return null;
    return getTargetValue(value as CompatMap, tail);
  };

  const target = node18 as any as CompatMap;

  const renderEntries: any = (baseline: any, path: string[]) => {
    const rows = [];
    let baselineTotal = 0;
    let targetTotal = 0;

    for (const [key, nodeValue] of Object.entries(baseline)) {
      const keyPath = [...path, key];
      const targetSupported = getTargetValue(target, keyPath);

      let childRows;
      if (isObject(nodeValue)) {
        const result = renderEntries(nodeValue, keyPath);
        debugger;
        childRows = result.rows;
        baselineTotal += result.baselineTotal;
        targetTotal += result.targetTotal;
      } else {
        baselineTotal += 1;
        targetTotal += targetSupported ? 1 : 0;
      }

      rows.push(
        <>
          <tr>
            <td>{key}</td>
            <td>{supported}</td>
            <td>
              {isObject(nodeValue)
                ? `${((targetTotal / baselineTotal) * 100).toFixed(0)}%`
                : targetSupported
                ? supported
                : unsupported}
            </td>
          </tr>
          {childRows}
        </>
      );
    }

    return {
      rows,
      baselineTotal,
      targetTotal,
    };
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>API</th>
            <th>Node 22</th>
            <th>Node 18</th>
          </tr>
        </thead>
        {renderEntries(node22, []).rows}
      </table>
    </div>
  );
}

export default App;
