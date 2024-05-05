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

      let childRows;

      if (isObject(nodeValue)) {
        const result = renderEntries(nodeValue, targets, keyPath);
        childRows = result.rows;
        baselineTotal += result.baselineTotal;
        for (const targetKey of Object.keys(targets)) {
          targetTotals[targetKey] += result.targetTotals[targetKey];
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
          <td>
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
          <tr onClick={() => expand(key)}>
            <td>{key}</td>
            <td>{supported}</td>
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
    node18,
    node20,
    workerd,
    wranglerJspm,
    wranglerUnenv,
    wranglerV3,
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>API</th>
            <th>{targetTitles["node22"]}</th>
            {Object.keys(targets).map((target) => (
              <th>{targetTitles[target as keyof typeof targetTitles]}</th>
            ))}
          </tr>
        </thead>
        {renderEntries(node22, targets, []).rows}
      </table>
    </div>
  );
};

export default App;
