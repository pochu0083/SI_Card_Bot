/**
 * Standalone test runner for cards.csv major type (Chinese + URL).
 * Run from project root: node scripts/runMajorCsvTests.js
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
  console.log("Cards CSV major tests\n");

  const csv = csvLoader.loadCardCsv();

  ok(csv.loaded, "cards.csv loaded");
  const majorRows = csv.rows.filter((r) => r.type === "major");
  ok(majorRows.length > 0, "has major rows");

  const withSuisoko = majorRows.filter((r) => r.url && r.url.includes("suisoko.com"));
  ok(withSuisoko.length === majorRows.length, "all major rows have suisoko.com URL");

  const withZh = majorRows.filter((r) => (r.name_zh_tw || r.name_zh_cn) && r.url && r.url.includes("suisoko.com"));
  ok(withZh.length === majorRows.length, "all major rows have name_zh_tw/name_zh_cn");

  const searchNames = csvLoader.getAllSearchNames("major");
  const matchedTw = getCardName("雷霆利爪", searchNames);
  const rowTw = matchedTw ? (csv.nameToRow[matchedTw] || (csv.aliasToRows[matchedTw] && csv.aliasToRows[matchedTw][0])) : null;
  ok(!!rowTw, "resolve Traditional Chinese 雷霆利爪");
  ok(rowTw && rowTw.url && rowTw.url.includes("suisoko.com"), "major URL from card_db (suisoko)");

  const matchedEn = getCardName("talons of lightning", searchNames);
  const rowEn = matchedEn ? (csv.nameToRow[matchedEn] || (csv.aliasToRows[matchedEn] && csv.aliasToRows[matchedEn][0])) : null;
  ok(rowEn && rowEn.name === "talons_of_lightning", "resolve English major name (talons of lightning)");

  const flowRow = csv.rows.find((r) => r.type === "major" && r.name === "flow_like_water_reach_like_air");
  ok(flowRow && flowRow.name_zh_tw && flowRow.url && flowRow.url.includes("suisoko.com"), "flow_like_water_reach_like_air has Chinese and URL");

  const vanishRow = csv.rows.find((r) => r.type === "major" && r.name === "vanish_softly_away_forgotten_by_all");
  ok(vanishRow && vanishRow.name_zh_tw && vanishRow.url && vanishRow.url.includes("suisoko.com"), "vanish_softly_away_forgotten_by_all has Chinese and URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
