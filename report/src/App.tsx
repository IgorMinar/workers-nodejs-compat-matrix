import React, { useState } from "react";
import "./App.css";

import tableData from "./data/table-data.json";
import node18 from "./data/node-18.json";
import node20 from "./data/node-20.json";
import node22 from "./data/node-22.json";
import nodeBaseline from "./data/baseline.json";
import bun from "./data/bun.json";
import deno from "./data/deno.json";
import workerd from "./data/workerd.json";
import wranglerJspm from "./data/wrangler-jspm-polyfills.json";
import wranglerUnenv from "./data/wrangler-unenv-polyfills.json";
import wranglerV3 from "./data/wrangler-v3-polyfills.json";
import versionMap from "./data/versionMap.json";
import { mismatch, stub, supported, unsupported } from "./constants";
import { Legend } from "./Legend";
import { TableCell, TableHeaderCell, TableRow } from "./Table";

const targetTitles = {
  node18: "node",
  node20: "node",
  node22: "node",
  bun: "bun",
  deno: "deno",
  workerd: "workerd",
  wranglerJspm: "wrangler",
  wranglerUnenv: "wrangler",
  wranglerV3: "wrangler",
};

const pct = (part: number, total: number) => {
  return `${((part / total) * 100).toFixed(0)}%`;
};

const App = () => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const targets = {
    node22,
    node20,
    node18,
    bun,
    deno,
    workerd,
    wranglerV3,
    wranglerJspm,
    wranglerUnenv,
  };

  const expand = (key: string) => {
    if (expanded.includes(key)) {
      setExpanded(expanded.filter((k) => k !== key));
    } else {
      setExpanded([...expanded, key]);
    }
  };

  const renderSupportValue = (value: string) => {
    switch (value) {
      case "supported":
        return supported;
      case "mismatch":
        return mismatch;
      case "stub":
        return stub;
      case "unsupported":
      case "default":
        return unsupported;
    }
  };

  const renderRow = (row: any[]) => {
    const [path, leafCount, baselineSupport, ...targets] = row;

    const pathParts = path.split(".");
    const key = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, pathParts.length - 1).join(".");
    const isExpanded = expanded.includes(parentPath);

    if (pathParts.length > 1 && !isExpanded) {
      return null;
    }

    const renderLeafCells = () => {
      return (
        <>
          <TableCell>{supported}</TableCell>
          {targets.map((target) => (
            <TableCell>{renderSupportValue(target)}</TableCell>
          ))}
        </>
      );
    };

    const renderAggregates = () => {
      return (
        <>
          <TableCell>100%</TableCell>
          {targets.map((target) => (
            <TableCell>
              <span title={`${target}/${baselineSupport}`}>
                {pct(target, baselineSupport)}
              </span>
            </TableCell>
          ))}
        </>
      );
    };

    return (
      <TableRow onClick={() => expand(path)} key={path}>
        <TableCell>
          <div className="flex justify-start items-center">
            <span className="opacity-0">
              {"_".repeat(pathParts.length * 2)}
            </span>
            {key}
            {leafCount > 0 && !expanded.includes(path) && (
              <span className="text-sm pl-2">▶</span>
            )}
            {leafCount > 0 && expanded.includes(path) && (
              <span className="text-sm pl-2">▼</span>
            )}
          </div>
        </TableCell>
        {leafCount === 0 ? renderLeafCells() : renderAggregates()}
      </TableRow>
    );
  };

  const renderTotalsRow = (totalsRow: any[]) => {
    const [baselineCount, ...targetTotals] = totalsRow.slice(2) as number[];

    return (
      <TableRow>
        <TableCell>
          <span className="font-semibold flex justify-start ml-4">Totals</span>
        </TableCell>
        <TableCell>
          <span className="font-semibold">100%</span>
        </TableCell>
        {targetTotals.map((targetTotal) => (
          <TableCell>
            <span className="font-semibold">
              {pct(targetTotal as number, baselineCount)}
            </span>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const [totalsRow, ...rows] = tableData;

  return (
    <div className="App">
      <div className="container mx-auto py-10">
        <div className="my-5 flex justify-between">
          <div className="flex gap-2">
            <button
              className="hover:bg-slate-100 border border-blue-400 text-blue-700 text-sm font-semibold px-3 py-2 rounded-md"
              onClick={() => setExpanded([...Object.keys(nodeBaseline)])}
            >
              Expand All
            </button>
            <button
              className="hover:bg-slate-100 border border-blue-400 text-blue-700 text-sm font-semibold px-3 py-2 rounded-md"
              onClick={() => setExpanded([])}
            >
              Collapse All
            </button>
          </div>
          <Legend />
        </div>
        <table className="table-fixed border border-slate-200 p-5 border-collapse">
          <thead>
            <tr>
              <TableHeaderCell width="min-w-[50ch]">API</TableHeaderCell>
              <TableHeaderCell width="w-[18ch]">baseline</TableHeaderCell>
              {Object.keys(targets).map((target) => (
                <TableHeaderCell width="w-[18ch]">
                  <div>{targetTitles[target as keyof typeof targetTitles]}</div>
                  <div className="text-xs font-light">
                    {versionMap[target as keyof typeof versionMap]}
                  </div>
                </TableHeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderTotalsRow(totalsRow)}
            {rows.map((row) => renderRow(row))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
