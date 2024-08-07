import React, { useState } from "react";
import "./App.css";

import tableData from "./data/table-data.json";
import versionMap from "./data/versionMap.json";
import timestamp from "./data/timestamp.json";
import { mismatch, stub, supported, unsupported } from "./constants";
import { Legend } from "./Legend";
import { TableCell, TableHeaderCell, TableRow } from "./Table";
import { formatPct, getDocsLink, getPolyfillSearchLink, pct } from "./utils";
import { z } from "zod";

// The thresholds beyond which we render support percentages as red or green
const RED_THRESHOLD = 20;
const GREEN_THRESHOLD = 80;

// This MUST match the ordering of `targets` in `generate-table-data.mjs`
const targetTitles = {
  node22: "node",
  node20: "node",
  node18: "node",
  bun: "bun",
  deno: "deno",
  workerd: "workerd",
  wranglerV3: "wrangler",
  wranglerUnenv: "wrangler",
};

const rowSchema = z.tuple([
  z.string(), // key
  z.number(), // leaf count
  z.number().or(z.string()), // basline
  // targets
  ...Object.keys(targetTitles).map(() => z.number().or(z.string())),
]);

type RowData = z.infer<typeof rowSchema>;

const App = () => {
  const [expanded, setExpanded] = useState<string[]>([]);

  console.log(timestamp);

  const expand = (key: string) => {
    if (expanded.some((k) => k.startsWith(key))) {
      setExpanded(expanded.filter((k) => !k.startsWith(key)));
    } else {
      setExpanded([...expanded, key]);
    }
  };

  const renderRow = (row: RowData) => {
    const [path, leafCount, baselineSupport, ...targets] = row;

    const pathParts = path.split(".");
    const key = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, pathParts.length - 1).join(".");

    const isExpanded = expanded.includes(parentPath);
    const isTopLevel = pathParts.length === 1;

    if (pathParts.length > 1 && !isExpanded) {
      return null;
    }

    const renderSupportValue = (value: string) => {
      switch (value) {
        case "supported":
          return supported;
        case "mismatch":
          return mismatch;
        case "stub":
          return stub;
        case "unsupported":
        default:
          return unsupported;
      }
    };

    const renderLeafCell = (value: string, targetIndex: number) => {
      const targetName = Object.keys(targetTitles)[targetIndex];
      const githubSearchLink = getPolyfillSearchLink(targetName, key);

      return (
        <TableCell>
          <div className="flex items-center gap-2 justify-center">
            <a href={githubSearchLink} target="_blank" rel="noreferrer">
              {renderSupportValue(value)}
            </a>
          </div>
        </TableCell>
      );
    };

    const renderLeafCells = () => {
      return (
        <>
          <TableCell>{supported}</TableCell>
          {targets.map((targetValue, targetIndex) =>
            renderLeafCell(targetValue as string, targetIndex)
          )}
        </>
      );
    };

    const renderAggregates = () => {
      return (
        <>
          <TableCell color="green">
            <span className="text-xs" title={"APIs count: " + baselineSupport}>
              {baselineSupport}
            </span>
          </TableCell>
          {targets.map((target) => {
            const [supported, mismatch, stub, unsupported] = (target as string)
              .split("/")
              .map((i) => parseInt(i as string));

            const total = supported + mismatch + stub;
            const percentage = pct(total, baselineSupport as number);

            let bgColor = "red";
            if (percentage > RED_THRESHOLD) {
              bgColor = "yellow";
            }
            if (percentage > GREEN_THRESHOLD) {
              bgColor = "green";
            }

            const tooltip = `Unsupported: ${unsupported}\nMismatch: ${mismatch}\nStubbed: ${stub}\nSupported: ${supported}`;

            return (
              <TableCell color={bgColor}>
                <div
                  title={tooltip}
                  className={`flex gap-3 justify-center items-center`}
                >
                  <span className="text-sm">{formatPct(percentage)}</span>
                  <div className="text-xs">
                    <span>
                      {unsupported}/{mismatch}/{stub}
                    </span>
                  </div>
                </div>
              </TableCell>
            );
          })}
        </>
      );
    };

    const renderKeyValue = () => {
      const content = (
        <>
          <span className="opacity-0">{"_".repeat(pathParts.length * 2)}</span>
          {key}
        </>
      );

      // Certain builtins like _http_agent don't have docs pages
      if (key.startsWith("_")) {
        return content;
      }

      if (!isTopLevel) return content;

      return (
        <>
          <span className="opacity-0">{"_".repeat(pathParts.length * 2)}</span>
          <a
            className="text-blue-900 hover:text-blue-500"
            href={getDocsLink(key)}
            target="_blank"
            rel="noreferrer"
          >
            {key}
          </a>
        </>
      );
    };

    return (
      <TableRow
        onClick={(e) => {
          // Don't expand/unexpand on link navigations
          if ((e.target as HTMLAnchorElement).nodeName === "A") {
            return;
          }
          expand(path);
        }}
        key={path}
      >
        <TableCell>
          <div className="flex justify-start items-center gap-2 text-sm">
            {renderKeyValue()}
            {leafCount > 0 && !expanded.includes(path) && (
              <span className="text-xs">▶</span>
            )}
            {leafCount > 0 && expanded.includes(path) && (
              <span className="text-xs">▼</span>
            )}
          </div>
        </TableCell>
        {leafCount === 0 ? renderLeafCells() : renderAggregates()}
      </TableRow>
    );
  };

  const renderTotalsRow = (totalsRow: any[]) => {
    const [baselineCount, ...targetTotals] = totalsRow.slice(2);

    return (
      <TableRow>
        <TableCell>
          <span className="font-semibold flex justify-start ml-4">Totals</span>
        </TableCell>
        <TableCell>
          <div>
            <span className="font-semibold text-sm">100%</span>
            <div className="text-xs">{baselineCount}</div>
          </div>
        </TableCell>
        {targetTotals.map((targetTotal) => {
          const [supported, mismatch, stub, unsupported] = (
            targetTotal as string
          )
            .split("/")
            .map((i) => parseInt(i as string));

          const total = supported + mismatch + stub;
          const percentage = pct(total, baselineCount as number);

          const tooltip = `Unsupported: ${unsupported}\nMismatch: ${mismatch}\nStubbed: ${stub}\nSupported: ${supported}`;

          return (
            <TableCell>
              <div title={tooltip}>
                <span className="text-sm font-semibold">
                  {formatPct(percentage)}
                </span>
                <div className="text-xs">
                  <span>
                    {unsupported}/{mismatch}/{stub}
                  </span>
                </div>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  const [totalsRow, ...rows] = tableData as RowData[];
  const allKeys = rows.map((row) => row[0] as string);

  return (
    <div className="App">
      <div className="container mx-auto py-10">
        <div className="my-5 flex justify-between items-center">
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
          <div className="text-sm">
            <span className="font-semibold mr-1">Generated:</span>
            {new Date(timestamp.timestamp).toLocaleString()}
          </div>
          <Legend />
        </div>
        <div className="text-left mb-5 text-sm">
          <h3 className="font-semibold text-lg mb-1">Notes</h3>
          <ul className="list-disc list-inside">
            <li className="mb-1">
              All percentages in the table represent API presence whether the shape of the API 
              matches against the baseline. They are not a calculation of implementation compliance. 
            </li>
            <li className="mb-1">
              The <span className="font-semibold">Baseline</span> column represents a union of Node.js v18, v20, and v22 API surfaces 
              that we use as node API compatibility target.
            </li>
          </ul>

        </div>
        <table className="table-fixed border border-slate-200 p-5 border-collapse">
          <thead>
            <tr className="sticky top-0 bg-white">
              <TableHeaderCell width="min-w-[35ch]">API</TableHeaderCell>
              <TableHeaderCell width="min-w-[8ch]">
                <div>baseline</div>
                <div className="text-xs font-light">22+20+18</div>
              </TableHeaderCell>
              {Object.entries(targetTitles).map(([targetKey, title]) => (
                <TableHeaderCell width="w-[15ch]">
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
