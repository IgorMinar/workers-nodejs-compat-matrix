import React, { useState } from "react";
import "./App.css";

import tableData from "./data/table-data.json";
import versionMap from "./data/versionMap.json";
import { mismatch, stub, supported, unsupported } from "./constants";
import { Legend } from "./Legend";
import { TableCell, TableHeaderCell, TableRow } from "./Table";

// This MUST match the ordering of `targets` in `generate-table-data.mjs`
const targetTitles = {
  node22: "node",
  node20: "node",
  node18: "node",
  bun: "bun",
  deno: "deno",
  workerd: "workerd",
  wranglerV3: "wrangler",
  wranglerJspm: "wrangler",
  wranglerUnenv: "wrangler",
};

const pct = (part: number, total: number) => {
  return `${((part / total) * 100).toFixed(0)}%`;
};

const App = () => {
  const [expanded, setExpanded] = useState<string[]>([]);

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
  const allKeys = rows.map((row) => row[0] as string);

  return (
    <div className="App">
      <div className="container mx-auto py-10">
        <div className="my-5 flex justify-between">
          <div className="flex gap-2">
            <a
              className="hover:bg-blue-500 bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-md flex items-center"
              href={`${process.env.PUBLIC_URL}/runtime-support.csv`}
              download="workerd-nodejs-support.csv"
            >
              Download (.csv)
            </a>
            <button
              className="hover:bg-slate-100 border border-blue-400 text-blue-700 text-sm font-semibold px-3 py-2 rounded-md"
              onClick={() => setExpanded([...allKeys])}
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
            <tr className="sticky top-0 bg-white">
              <TableHeaderCell width="min-w-[50ch]">API</TableHeaderCell>
              <TableHeaderCell width="w-[18ch]">
                <div>baseline</div>
                <div className="text-xs font-light">Node 22+20+18</div>
              </TableHeaderCell>
              {Object.entries(targetTitles).map(([targetKey, title]) => (
                <TableHeaderCell width="w-[18ch]">
                  <div>{title}</div>
                  <div className="text-xs font-light">
                    {versionMap[targetKey as keyof typeof versionMap]}
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
