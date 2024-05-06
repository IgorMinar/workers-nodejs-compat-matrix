import React, { useState } from "react";
import "./App.css";

import node18 from "./data/node-18.json";
import node20 from "./data/node-20.json";
import workerd from "./data/workerd.json";
import wranglerJspm from "./data/wrangler-jspm-polyfills.json";
import wranglerUnenv from "./data/wrangler-unenv-polyfills.json";
import wranglerV3 from "./data/wrangler-v3-polyfills.json";
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

const targetTitles = {
  node18: "Node 18",
  node20: "Node 20",
  node22: "Node 22",
  workerd: "Workerd",
  wranglerJspm: "Wrangler (jspm)",
  wranglerUnenv: "Wrangler (unenv)",
  wranglerV3: "Wrangler (v3)",
};
const App = () => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const getTargetValue: any = (map: CompatMap, path: string[]) => {
    if (path.length === 0) {
      return map;
    }
    const [head, ...tail] = path;
    const value = map[head];
    if (value == null || value === undefined) return null;
    return getTargetValue(value as CompatMap, tail);
  };

  const renderEntries: any = (
    baseline: any,
    targets: Record<string, CompatMap>,
    path: string[]
  ) => {
    const rows = [];
    let baselineTotal = 0;
    let targetTotals: Record<string, number> = Object.keys(targets).reduce(
      (acc, key) => ({ ...acc, [key]: 0 }),
      {}
    );

    for (const [key, nodeValue] of Object.entries(baseline)) {
      const keyPath = [...path, key];

      if (path.length === 0) {
        baselineTotal = 0;
        targetTotals = Object.keys(targets).reduce(
          (acc, key) => ({ ...acc, [key]: 0 }),
          {}
        );
      }

      const isModule = path.length === 1;

      let childRows;

      if (isObject(nodeValue)) {
        const result = renderEntries(nodeValue, targets, keyPath);
        childRows = result.rows;
        baselineTotal = result.baselineTotal;
        for (const targetKey of Object.keys(targets)) {
          targetTotals[targetKey] = result.targetTotals[targetKey];
        }
      } else {
        baselineTotal += 1;
        for (const targetKey of Object.keys(targets)) {
          const targetSupported = getTargetValue(targets[targetKey], keyPath);
          targetTotals[targetKey] += targetSupported ? 1 : 0;
        }
      }

      let columns = [];
      for (const targetKey of Object.keys(targets)) {
        const targetSupported = getTargetValue(targets[targetKey], keyPath);

        columns.push(
          <td className="border border-slate-200">
            {isObject(nodeValue)
              ? `${((targetTotals[targetKey] / baselineTotal) * 100).toFixed(
                  0
                )}%`
              : targetSupported
                ? supported
                : unsupported}
          </td>
        );
      }

      const expand = (key: string) => {
        if (expanded.includes(key)) {
          setExpanded(expanded.filter((k) => k !== key));
        } else {
          setExpanded([...expanded, key]);
        }
      };

      rows.push(
        <>
          <tr
            className="border-slate-200 even:bg-slate-100"
            onClick={() => expand(key)}
          >
            <td className={`w-[40ch] p-1 text-left border border-slate-200`}>
              <span className="opacity-0">
                {"_".repeat(keyPath.length * 2)}
              </span>
              {/* <span className={isModule ? "font-bold" : ""}> */}
              {key}
              {isObject(nodeValue) && <span>▼</span>}
              {/* </span> */}
            </td>
            <td className="border border-slate-200">{supported}</td>
            {columns}
          </tr>
          {expanded.includes(key) && childRows}
        </>
      );
    }

    return {
      rows,
      baselineTotal,
      targetTotals,
    };
  };

  const targets = {
    node20,
    node18,
    workerd,
    wranglerV3,
    wranglerJspm,
    wranglerUnenv,
  };

  return (
    <div className="App">
      <div className="container mx-auto p-10">
        <table className="table-fixed border border-slate-200 p-5 border-collapse">
          <thead>
            <tr className="">
              <th>API</th>
              <th className="w-[18ch]">{targetTitles["node22"]}</th>
              {Object.keys(targets).map((target) => (
                <th className="w-[18ch]">
                  {targetTitles[target as keyof typeof targetTitles]}
                </th>
              ))}
            </tr>
          </thead>
          {renderEntries(node22, targets, []).rows}
        </table>
      </div>
    </div>
  );
};

export default App;
