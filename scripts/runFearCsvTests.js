/**
 * Standalone test runner for cards.csv fear type (Chinese + URL).
 * Run from project root: node scripts/runFearCsvTests.js
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
  console.log("Cards CSV fear tests\n");

  const csv = csvLoader.loadCardCsv();

  ok(csv.loaded, "cards.csv loaded");
  const fearRows = csv.rows.filter((r) => r.type === "fear");
  ok(fearRows.length > 0, "has fear rows");

  const withSuisoko = fearRows.filter((r) => r.url && r.url.includes("suisoko.com"));
  ok(withSuisoko.length === fearRows.length, "all fear rows have suisoko.com URL");

  const withZh = fearRows.filter((r) => (r.name_zh_tw || r.name_zh_cn) && r.url && r.url.includes("suisoko.com"));
  ok(withZh.length === fearRows.length, "all fear rows have name_zh_tw/name_zh_cn");

  const searchNames = csvLoader.getAllSearchNames("fear");
  const matchedTw = getCardName("目不可視的恐懼", searchNames);
  const rowTw = matchedTw ? (csv.nameToRow[matchedTw] || (csv.aliasToRows[matchedTw] && csv.aliasToRows[matchedTw][0])) : null;
  ok(!!rowTw, "resolve Traditional Chinese 目不可視的恐懼");
  ok(rowTw && rowTw.url && rowTw.url.includes("suisoko.com"), "fear URL from card_db (suisoko)");

  const matchedCn = getCardName("目不可视的恐惧", searchNames);
  ok(!!matchedCn, "resolve Simplified Chinese 目不可视的恐惧");

  const matchedEn = getCardName("fear of the unseen", searchNames);
  const rowEn = matchedEn ? (csv.nameToRow[matchedEn] || (csv.aliasToRows[matchedEn] && csv.aliasToRows[matchedEn][0])) : null;
  ok(rowEn && rowEn.name === "fear_of_the_unseen", "resolve English fear name (fear of the unseen)");

  const typoRow = csv.rows.find((r) => r.type === "fear" && r.name === "overseas_trade_seem_safer");
  ok(typoRow && typoRow.name_zh_tw && typoRow.url && typoRow.url.includes("suisoko.com"), "overseas_trade_seem_safer has Chinese and URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
