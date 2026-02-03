/**
 * Standalone test runner for cards.csv blight type (Chinese + URL).
 * Run from project root: node scripts/runBlightCsvTests.js
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
  console.log("Cards CSV blight tests\n");

  const csv = csvLoader.loadCardCsv();

  ok(csv.loaded, "cards.csv loaded");
  const blightRows = csv.rows.filter((r) => r.type === "blight");
  ok(blightRows.length > 0, "has blight rows");

  const withSuisoko = blightRows.filter((r) => r.url && r.url.includes("suisoko.com"));
  ok(withSuisoko.length === blightRows.length, "all blight rows have suisoko.com URL");

  const withZh = blightRows.filter((r) => (r.name_zh_tw || r.name_zh_cn) && r.url && r.url.includes("suisoko.com"));
  ok(withZh.length === blightRows.length, "all blight rows have name_zh_tw/name_zh_cn");

  const searchNames = csvLoader.getAllSearchNames("blight");
  const matchedTw = getCardName("惡性循還", searchNames);
  const rowTw = matchedTw ? (csv.nameToRow[matchedTw] || (csv.aliasToRows[matchedTw] && csv.aliasToRows[matchedTw][0])) : null;
  ok(!!rowTw, "resolve Traditional Chinese 惡性循還");
  ok(rowTw && rowTw.url && rowTw.url.includes("suisoko.com"), "blight URL from card_db (suisoko)");

  const matchedCn = getCardName("恶性循还", searchNames);
  ok(!!matchedCn, "resolve Simplified Chinese 恶性循还");

  const matchedEn = getCardName("downward spiral", searchNames);
  const rowEn = matchedEn ? (csv.nameToRow[matchedEn] || (csv.aliasToRows[matchedEn] && csv.aliasToRows[matchedEn][0])) : null;
  ok(rowEn && rowEn.name === "downward_spiral", "resolve English blight name (downward spiral)");

  const typoRow = csv.rows.find((r) => r.type === "blight" && r.name === "the_border_of_live_and_death");
  ok(typoRow && typoRow.name_zh_tw && typoRow.url && typoRow.url.includes("suisoko.com"), "the_border_of_live_and_death has Chinese and URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
