/**
 * Standalone test runner for cards.csv minor type (Chinese + URL).
 * Run from project root: node scripts/runMinorCsvTests.js
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
  console.log("Cards CSV minor tests\n");

  const csv = csvLoader.loadCardCsv();

  ok(csv.loaded, "cards.csv loaded");
  const minorRows = csv.rows.filter((r) => r.type === "minor");
  ok(minorRows.length > 0, "has minor rows");

  const withSuisoko = minorRows.filter((r) => r.url && r.url.includes("suisoko.com"));
  ok(withSuisoko.length >= 100, "at least 100 minor rows have suisoko.com URL");

  const withZh = minorRows.filter((r) => (r.name_zh_tw || r.name_zh_cn) && r.url && r.url.includes("suisoko.com"));
  ok(withZh.length >= 100, "at least 100 minor rows have name_zh_tw/name_zh_cn");

  const searchNames = csvLoader.getAllSearchNames("minor");
  const matchedTw = getCardName("兇猛裂齒獸", searchNames);
  const rowTw = matchedTw ? (csv.nameToRow[matchedTw] || (csv.aliasToRows[matchedTw] && csv.aliasToRows[matchedTw][0])) : null;
  ok(!!rowTw, "resolve Traditional Chinese 兇猛裂齒獸");
  ok(rowTw && rowTw.url && rowTw.url.includes("suisoko.com"), "minor URL from card_db (suisoko)");

  const matchedEn = getCardName("savage mawbeasts", searchNames);
  const rowEn = matchedEn ? (csv.nameToRow[matchedEn] || (csv.aliasToRows[matchedEn] && csv.aliasToRows[matchedEn][0])) : null;
  ok(rowEn && rowEn.name === "savage_mawbeasts", "resolve English minor name (savage mawbeasts)");

  const typoRow = csv.rows.find((r) => r.type === "minor" && r.name === "twilight_fog_brings_madness");
  ok(typoRow && typoRow.name_zh_tw && typoRow.url && typoRow.url.includes("suisoko.com"), "twilight_fog_brings_madness has Chinese and URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
