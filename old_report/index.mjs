// TODO:
//  - this needs to be updated to work with all 3 node versions
//  - this needs to be updated to work with the new wrangler version
//  - add support for *globals*
//  - add support for "class" type and display mismatches as "partially polyfilled"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readAPIs(name) {
  const filepath = path.resolve(__dirname, "..", name, "apis.json");
  return JSON.parse(fs.readFileSync(filepath));
}

// TODO: update to work with 3 node versions
const NODE_APIS = readAPIs("node");
const WORKERD_APIS = readAPIs("workerd");
// TODO: update directory names and add 3rd wrangler version
// const WRANGLER_OLD_POLYFILLS_APIS = readAPIs("wrangler-old-polyfills");
// const WRANGLER_NEW_POLYFILLS_APIS = readAPIs("wrangler-new-polyfills");
const WRANGLER_OLD_POLYFILLS_APIS = readAPIs("wrangler-jspm-polyfills");
const WRANGLER_NEW_POLYFILLS_APIS = readAPIs("wrangler-v3-polyfills");

function get(object, path) {
  if (path.length === 0) return object;
  const [head, ...tail] = path;
  const value = object[head];
  if (value == null || value === "undefined") return null;
  return get(value, tail);
}

function getText(isObject, supported) {
  if (isObject) return "";
  if (supported) return "SUPPORTED";
  return "UNSUPPORTED";
}

const supportedColour = "hsl(120, 50%, 70%)";
const unsupportedColour = "hsl(0, 50%, 70%)";
function getBackgroundColour(isObject, supported) {
  if (isObject) return "transparent";
  if (!supported) return unsupportedColour;
  return supportedColour;
}

const sliceClassNames = new Set();
function getSliceClassName(slicedPath) {
  return slicedPath.join("-").replace("/", "");
}

function visit(nodeObject, path) {
  const rows = [];
  let nodeTotal = 0;
  let workerdTotal = 0;
  let wranglerOldTotal = 0;
  let wranglerNewTotal = 0;

  let className = "";
  for (let i = 1; i < path.length + 1; i++) {
    const sliceClassName = getSliceClassName(path.slice(0, i));
    sliceClassNames.add(sliceClassName);
    className += `${sliceClassName} `;
  }

  for (const [key, nodeValue] of Object.entries(nodeObject)) {
    const keyPath = [...path, key];
    let keyClassName = className;

    const workerdSupported = nodeValue === get(WORKERD_APIS, keyPath);
    const wranglerOldSupported =
      nodeValue === get(WRANGLER_OLD_POLYFILLS_APIS, keyPath);
    const wranglerNewSupported =
      nodeValue === get(WRANGLER_NEW_POLYFILLS_APIS, keyPath);

    const isObject =
      typeof nodeValue === "object" && Object.keys(nodeValue).length > 0;
    const isModule = keyPath.length === 1;

    let nodeBgColor = getBackgroundColour(isObject, nodeValue);
    let workerdBgColor = getBackgroundColour(isObject, workerdSupported);
    let wranglerOldBgColor = getBackgroundColour(
      isObject,
      wranglerOldSupported
    );
    let wranglerNewBgColor = getBackgroundColour(
      isObject,
      wranglerNewSupported
    );

    let nodeText = getText(isObject, true);
    let workerdText = getText(isObject, workerdSupported);
    let wranglerOldText = getText(isObject, wranglerOldSupported);
    let wranglerNewText = getText(isObject, wranglerNewSupported);

    let nodeTitle = key;
    let workerdTitle = key;
    let wranglerOldTitle = key;
    let wranglerNewTitle = key;

    let dataset = "";

    let childRows = [];
    if (isObject) {
      const result = visit(nodeValue, keyPath);
      childRows = result.rows;

      nodeText = `${((result.nodeTotal / result.nodeTotal) * 100).toFixed(0)}%`;
      workerdText = `${((result.workerdTotal / result.nodeTotal) * 100).toFixed(
        0
      )}%`;
      wranglerOldText = `${(
        (result.wranglerOldTotal / result.nodeTotal) *
        100
      ).toFixed(0)}%`;
      wranglerNewText = `${(
        (result.wranglerNewTotal / result.nodeTotal) *
        100
      ).toFixed(0)}%`;

      nodeBgColor = `hsl(${(
        (result.nodeTotal / result.nodeTotal) *
        120
      ).toFixed(0)}, 50%, 70%)`;
      workerdBgColor = `hsl(${(
        (result.workerdTotal / result.nodeTotal) *
        120
      ).toFixed(0)}, 50%, 70%)`;
      wranglerOldBgColor = `hsl(${(
        (result.wranglerOldTotal / result.nodeTotal) *
        120
      ).toFixed(0)}, 50%, 70%)`;
      wranglerNewBgColor = `hsl(${(
        (result.wranglerNewTotal / result.nodeTotal) *
        120
      ).toFixed(0)}, 50%, 70%)`;

      nodeTitle += ` (${result.nodeTotal} / ${result.nodeTotal})`;
      workerdTitle += ` (${result.workerdTotal} / ${result.nodeTotal})`;
      wranglerOldTitle += ` (${result.wranglerOldTotal} / ${result.nodeTotal})`;
      wranglerNewTitle += ` (${result.wranglerNewTotal} / ${result.nodeTotal})`;

      nodeTotal += result.nodeTotal;
      workerdTotal += result.workerdTotal;
      wranglerOldTotal += result.wranglerOldTotal;
      wranglerNewTotal += result.wranglerNewTotal;

      keyClassName += "is-object ";
      dataset += `data-toggle=${getSliceClassName(keyPath)}`;
    } else {
      nodeTotal += 1;
      workerdTotal += workerdSupported;
      wranglerOldTotal += wranglerOldSupported;
      wranglerNewTotal += wranglerNewSupported;
    }
    keyClassName += `depth-${path.length}`;

    rows.push(
      `<tr class="${keyClassName}" ${dataset}>
        ${renderInfoCell(isObject, isModule, path, key)}
        ${renderSupportCell(nodeTitle, nodeBgColor, nodeText)}
        ${renderSupportCell(workerdTitle, workerdBgColor, workerdText)}
        ${renderSupportCell(
          wranglerOldTitle,
          wranglerOldBgColor,
          wranglerOldText
        )}
        ${renderSupportCell(
          wranglerNewTitle,
          wranglerNewBgColor,
          wranglerNewText
        )}
      </tr>`,
      ...childRows
    );
  }

  return {
    rows,
    nodeTotal,
    workerdTotal,
    wranglerOldTotal,
    wranglerNewTotal,
  };
}

const renderInfoCell = (isObject, isModule, nodePath, key) => {
  const renderContent = () => {
    switch (true) {
      case isModule:
        return `<b>${key}</b>`;
      case isObject:
        return `<b>${key}</b>`;
      default:
        return key;
    }
  };

  return `
    <td style="padding-left: ${nodePath.length + 0.5}em;">
      ${renderContent()}
    </td>
  `;
};

const renderSupportCell = (title, bgColor, text) => {
  return `<td title="${title}" style="background-color: ${bgColor}">${text}</td>`;
};

const styles = [];

function buildTable(moduleNames) {
  const filteredNodeApis = Object.fromEntries(
    Object.entries(NODE_APIS).filter(([moduleName]) =>
      moduleNames.includes(moduleName)
    )
  );
  const fullResult = visit(filteredNodeApis, []);

  const headNodeText = `Node.js 20.9.0 (${(
    (fullResult.nodeTotal / fullResult.nodeTotal) *
    100
  ).toFixed(0)}%)`;
  const headWorkerdText = `workerd 1.20231030.0 (${(
    (fullResult.workerdTotal / fullResult.nodeTotal) *
    100
  ).toFixed(0)}%)`;
  const headWranglerOldText = `Wrangler (Old Polyfills) (${(
    (fullResult.wranglerOldTotal / fullResult.nodeTotal) *
    100
  ).toFixed(0)}%)`;
  const headWranglerNewText = `Wrangler (New Polyfills) (${(
    (fullResult.wranglerNewTotal / fullResult.nodeTotal) *
    100
  ).toFixed(0)}%)`;

  const headNodeTitle = `${fullResult.nodeTotal} / ${fullResult.nodeTotal}`;
  const headWorkerdTitle = `${fullResult.workerdTotal} / ${fullResult.nodeTotal}`;
  const headWranglerOldTitle = `${fullResult.wranglerOldTotal} / ${fullResult.nodeTotal}`;
  const headWranglerNewTitle = `${fullResult.wranglerNewTotal} / ${fullResult.nodeTotal}`;

  const headRows = [
    "<tr>",
    "<th>API</th>",
    `<th title="${headNodeTitle}">${headNodeText}</th>`,
    `<th title="${headWorkerdTitle}">${headWorkerdText}</th>`,
    `<th title="${headWranglerOldTitle}">${headWranglerOldText}</th>`,
    `<th title="${headWranglerNewTitle}">${headWranglerNewText}</th>`,
    "</tr>",
  ];

  const sliceClassNamesArray = Array.from(sliceClassNames);
  const sliceClassNamesDisplayNoneSelectors = sliceClassNamesArray
    .map((n) => `table.${n} > tbody > tr.${n}`)
    .join(", ");
  const sliceClassNamesRotateSelectors = sliceClassNamesArray.map(
    (n) => `table.${n} > tbody > tr[data-toggle="${n}"] > td:first-child > span`
  );
  styles.push(`${sliceClassNamesDisplayNoneSelectors} { display: none; }`);
  styles.push(
    `${sliceClassNamesRotateSelectors} { transform: rotate(-90deg); }`
  );

  const tableClass = sliceClassNamesArray.join(" ");

  return `<table class="${tableClass}">
        <thead>
            ${headRows.join("\n")}
        </thead>
        <tbody>
            ${fullResult.rows.join("\n")}
        </tbody>
    </table>`;
}

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
const relevantAPIs = Object.keys(NODE_APIS)
  .filter((name) => !irrelevantAPIs.includes(name))
  .sort();

let template = fs.readFileSync(path.join(__dirname, "template.html"), "utf-8");
const body = `
<h1>Workers Node.js Support 🐢</h1>
<p>
This page gives an overview of the supported Node.js APIs across:
</p>
<ul>
<li><code>node@20.9.0</code></li>
<li><code>workerd@1.20231030.0</code> with the <code>nodejs_compat</code> compatibility flag enabled</li>
<li><code>wrangler@3.15.0</code> polyfilling with the <code>--node-compat</code> flag enabled</li>
<li><code>wrangler@<a href="https://github.com/cloudflare/workers-sdk/pull/3832">#3832</a></code> polyfilling with the <code>--node-compat</code> flag enabled</li>
</ul>
<p>
Note "support" is defined as matching <code>typeof</code>s with Node, where <code>typeof null === "null"</code> instead of <code>"object"</code>.<br>
For the new polyfills, if a function's source code contains <a href="https://github.com/jspm/jspm-core/blob/62b5576587a8ed96b4840ffa88ac86da09d48221/nodelibs/browser/async_hooks.js#L2"><code>"not supported by JSPM"</code></a> or <a href="https://github.com/jspm/jspm-core/blob/62b5576587a8ed96b4840ffa88ac86da09d48221/nodelibs/browser/http2.js#L11"><code>"unimplemented("</code></a>, it's marked as unsupported.<br>
It's likely some of the polyfills don't actually work on Workers.
</p>
<h2 title="APIs that could feasibly be useful in Workers">Relevant APIs</h2>
${buildTable(relevantAPIs)}
<h2 title="APIs that probably don't make sense in Workers">Irrelevant APIs</h2>
${buildTable(irrelevantAPIs)}
`;
template = template.replace("%BODY%", body);
template = template.replace("%HEAD%", `<style>${styles.join("\n")}</style>`);

fs.writeFileSync(path.resolve(__dirname, "..", "dist", "index.html"), template);
