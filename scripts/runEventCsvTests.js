/**
 * Standalone test runner for cards.csv event type (Chinese + alias + URL).
 * Run from project root: node scripts/runEventCsvTests.js
 */

const path = require("path");

process.chdir(path.join(__dirname, ".."));

const csvLoader = require("../commands/loadCardCsv.js");
const { getCardName } = require("../commands/sendCardLink.js");

let passed = 0;
let failed = 0;

function ok(cond, msg) {
  if (cond) {
    passed++;
    console.log("  ✓", msg);
  } else {
    failed++;
    console.log("  ✗", msg);
  }
}

function main() {
  console.log("Cards CSV event tests\n");

  const csv = csvLoader.loadCardCsv();

  ok(csv.loaded, "cards.csv loaded");
  const eventRows = csv.rows.filter((r) => r.type === "event");
  ok(eventRows.length > 0, "has event rows");

  const withAliases = eventRows.filter((r) => r.aliases && r.aliases.length > 0);
  ok(withAliases.length > 0, "event rows use semicolon-separated aliases");
  const puttingDown = eventRows.find((r) => r.name === "putting_down_roots");
  ok(puttingDown && puttingDown.aliases && puttingDown.aliases.includes("the_center_crumbles"), "aliases column parsed (putting_down_roots)");

  const searchNames = csvLoader.getAllSearchNames("event");
  const matchedTw = getCardName("奴隸起義", searchNames);
  const rowTw = matchedTw ? (csv.nameToRow[matchedTw] || (csv.aliasToRows[matchedTw] && csv.aliasToRows[matchedTw][0])) : null;
  ok(!!rowTw, "resolve Traditional Chinese 奴隸起義");
  ok(rowTw && rowTw.url && rowTw.url.includes("suisoko.com"), "event URL from card_db (suisoko)");

  const matchedCn = getCardName("奴隶起义", searchNames);
  ok(!!matchedCn, "resolve Simplified Chinese 奴隶起义");

  const matchedAlias = getCardName("内地崩潰", searchNames);
  const rowsAlias = matchedAlias ? csv.aliasToRows[matchedAlias] : null;
  ok(rowsAlias && rowsAlias.length > 0 && rowsAlias[0].name === "putting_down_roots", "resolve Chinese alias (aliases_zh_tw) to event");

  const withZhAliases = eventRows.filter(
    (r) => (r.aliases_zh_tw && r.aliases_zh_tw.length > 0) || (r.aliases_zh_cn && r.aliases_zh_cn.length > 0),
  );
  ok(withZhAliases.length > 0, "event rows have aliases_zh_tw or aliases_zh_cn");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
