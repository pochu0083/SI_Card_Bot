/**
 * Standalone test runner for scenarios.csv (Chinese + image_urls).
 * Run from project root: node scripts/runScenariosCsvTests.js
 */

const path = require("path");

process.chdir(path.join(__dirname, ".."));

const namesCsv = require("../commands/loadNamesCsv.js");
const { loadScenariosCsv } = namesCsv;
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
  console.log("Scenarios CSV tests\n");

  const csv = loadScenariosCsv();

  ok(csv.loaded, "scenarios.csv loaded");
  ok(csv.rows.length >= 1, "has at least one scenario row");

  const searchNames = csv.getSearchNames();
  ok(searchNames.length > 0, "getSearchNames() returns names");

  const key = namesCsv.normalizeSearch("blitz");
  const rowBlitz = csv.nameToRow[key];
  ok(!!rowBlitz, "resolve by key (blitz)");
  ok(rowBlitz && rowBlitz.name === "Blitz", "blitz name");
  ok(rowBlitz && rowBlitz.urls && rowBlitz.urls.length >= 1, "blitz has image_urls");

  const matchedGtIH = getCardName("guard the isle's heart", searchNames);
  const rowGtIH = matchedGtIH ? csv.nameToRow[matchedGtIH] : null;
  ok(!!rowGtIH, "resolve by name (Guard the Isle's Heart)");
  ok(rowGtIH && rowGtIH.urls && rowGtIH.urls[0].includes("GuardtheIslesHeart"), "GtIH URL");

  const matchedTw = getCardName("閃電戰", searchNames);
  const rowTw = matchedTw ? csv.nameToRow[matchedTw] : null;
  ok(!!rowTw, "resolve Traditional Chinese 閃電戰");
  ok(rowTw && rowTw.name === "Blitz", "Blitz row from TW");

  const matchedCn = getCardName("岛屿之心守卫战", searchNames);
  const rowCn = matchedCn ? csv.nameToRow[matchedCn] : null;
  ok(!!rowCn, "resolve Simplified Chinese 岛屿之心守卫战");
  ok(rowCn && rowCn.name === "Guard the Isle's Heart", "GtIH from CN");

  const withUrls = csv.rows.filter((r) => r.urls && r.urls.length > 0);
  ok(withUrls.length === csv.rows.length, "all rows have at least one image URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
