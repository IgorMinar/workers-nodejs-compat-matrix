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

const isObject = (nodeValue: any) => typeof nodeValue === "object";

function App() {
  const calculateCompatibility: any = (
    candidate: any,
    baseline: any = node22
  ) => {
    return Object.entries(baseline).reduce((acc: any, [key, val]: any) => {
      // if (key === "_extensions") {
      //   console.log(candidate);
      //   console.log(baseline);
      //   debugger;
      // }
      console.log(baseline);
      console.log(candidate);
      debugger;

      const from = val;
      const to =
        candidate && key in candidate ? candidate[key as any] : undefined;

      // If we're comparing objects, we need to recurse
      // if (to && isObject(from) && isObject(to)) {
      if (isObject(from)) {
        if (isObject(to)) {
          return {
            ...acc,
            [key]: calculateCompatibility(to, from),
          };
        } else {
          return Object.keys(from).reduce(
            (acc, key) => ({ ...acc, [key]: false }),
            { acc }
          );
        }
      }

      // For leaf nodes, the candidate value is supported if it's defined and equals
      // the value of the baseline (ie. 'function' === 'function')
      return {
        ...acc,
        [key]: to !== null && to !== undefined && from === to,
      };
    }, {});
  };

  const [compatMap, setCompatMap] = useState({
    baseline: {} as any,
    node18: {} as any,
    node20: {} as any,
    workerd: {} as any,
    wranglerJspm: {} as any,
    wranglerUnenv: {} as any,
    wranglerV3: {} as any,
  });

  useEffect(() => {
    setCompatMap({
      baseline: node22,
      node18: calculateCompatibility(node18),
      node20: calculateCompatibility(node20),
      workerd: calculateCompatibility(workerd),
      wranglerJspm: calculateCompatibility(wranglerJspm),
      wranglerUnenv: calculateCompatibility(wranglerUnenv),
      wranglerV3: calculateCompatibility(wranglerV3),
    });
  }, []);

  // const renderRow = (key: string, path: string[]) => {
  //   return (
  //     <tr>
  //       <td>{key}</td>
  //     </tr>
  //   );
  // };

  // const renderEntry = (key: string, value: any) => {
  //   if (isObject(value)) {
  //   } else {
  //     return (
  //       <tr>
  //         <td>{key}</td>
  //         <td>{compatMap.baseline[key]}</td>
  //         <td>{compatMap.node18[key]}</td>
  //       </tr>
  //     );
  //   }
  // };

  const renderEntries: any = (baseline: any, entries: any[]) => {
    return Object.keys(baseline).map((key) => {
      if (key === "inspector/promises") {
        debugger;
      }

      const entryValues = entries.map((entry) =>
        entry && key in entry ? entry[key] : null
      );

      if (isObject(baseline[key])) {
        return renderEntries(baseline[key], entryValues);
      }

      return (
        <tr>
          <td>{key}</td>
          <td>SUPPORTED</td>
          <td>{entries[0][key]}</td>
        </tr>
      );
    });
  };

  if (Object.keys(compatMap.node18).length === 0) {
    return (
      <div className="App">
        <div>Loading...</div>
      </div>
    );
  }

  console.log(node22);
  console.log(compatMap.node18);
  return (
    <div className="App">
      <table>{renderEntries(node22, [compatMap.node18])}</table>
    </div>
  );
}

export default App;
