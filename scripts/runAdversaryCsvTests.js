/**
 * Standalone test runner for adversary CSV (Chinese + URL).
 * Run from project root: node scripts/runAdversaryCsvTests.js
 */

const path = require("path");

process.chdir(path.join(__dirname, ".."));

const namesCsv = require("../commands/loadNamesCsv.js");
const { loadAdversariesCsv } = namesCsv;
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
  console.log("Adversary CSV tests\n");

  const csv = loadAdversariesCsv();

  ok(csv.loaded, "CSV loaded");
  ok(csv.rows.length === 8, "8 rows");

  const key = namesCsv.normalizeSearch("prussia");
  const rowPrussia = csv.nameToRow[key];
  ok(!!rowPrussia, "resolve English key prussia");
  ok(rowPrussia && rowPrussia.name === "The Kingdom of Brandenburg-Prussia", "prussia name");
  ok(rowPrussia && rowPrussia.urls && rowPrussia.urls[0].includes("suisoko.com"), "prussia URL from suisoko");

  const searchNames = csv.getSearchNames();
  const matchedSwedenTw = getCardName("瑞典王國", searchNames);
  const rowSwedenTw = matchedSwedenTw ? csv.nameToRow[matchedSwedenTw] : null;
  ok(!!rowSwedenTw, "resolve Traditional Chinese 瑞典王國");
  ok(rowSwedenTw && rowSwedenTw.name === "The Kingdom of Sweden", "Sweden row");
  ok(rowSwedenTw && rowSwedenTw.urls[0].includes("suisoko.com"), "Sweden URL from suisoko");

  const matchedSwedenCn = getCardName("瑞典王国", searchNames);
  const rowSwedenCn = matchedSwedenCn ? csv.nameToRow[matchedSwedenCn] : null;
  ok(!!rowSwedenCn, "resolve Simplified Chinese 瑞典王国");
  ok(rowSwedenCn && rowSwedenCn.name === "The Kingdom of Sweden", "Sweden row (CN)");

  const matchedEngland = getCardName("英格蘭王國", searchNames);
  const rowEngland = matchedEngland ? csv.nameToRow[matchedEngland] : null;
  ok(!!rowEngland, "resolve Traditional 英格蘭王國 → England");
  ok(rowEngland && rowEngland.urls[0].includes("England"), "England URL");

  const matchedMining = getCardName("Habsburg Mining", searchNames);
  const rowMining = matchedMining ? csv.nameToRow[matchedMining] : null;
  ok(!!rowMining, "resolve English 'Habsburg Mining'");
  ok(rowMining && rowMining.urls[0].includes("Habsburg_Mining"), "Habsburg Mining URL");

  let allUrlsSuisoko = true;
  for (const row of csv.rows) {
    if (!row.urls || !row.urls[0] || !row.urls[0].includes("suisoko.com")) allUrlsSuisoko = false;
  }
  ok(allUrlsSuisoko, "all rows have suisoko.com image URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
