/**
 * Standalone test runner for player_aids.csv (base, je, ni + Chinese).
 * Run from project root: node scripts/runPlayerAidsCsvTests.js
 */

const path = require("path");

process.chdir(path.join(__dirname, ".."));

const namesCsv = require("../commands/loadNamesCsv.js");
const { loadPlayerAidsCsv } = namesCsv;
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
  console.log("Player aids CSV tests\n");

  const csv = loadPlayerAidsCsv();

  ok(csv.loaded, "player_aids.csv loaded");
  ok(csv.rows.length >= 1, "has at least one player aid row");

  const searchNames = csv.getSearchNames();
  ok(searchNames.length > 0, "getSearchNames() returns names");

  const keyBase = namesCsv.normalizeSearch("base");
  const rowBase = csv.nameToRow[keyBase];
  ok(!!rowBase, "resolve by key (base)");
  ok(rowBase && rowBase.name && rowBase.name.toLowerCase().includes("base"), "base name");
  ok(rowBase && rowBase.urls && rowBase.urls.length >= 1, "base has image_urls");

  const keyJe = namesCsv.normalizeSearch("je");
  const rowJe = csv.nameToRow[keyJe];
  ok(!!rowJe, "resolve by key (je)");
  ok(rowJe && rowJe.urls && rowJe.urls.some((u) => u.includes("JE") || u.includes("Player_Aids")), "je has URLs");

  const keyNi = namesCsv.normalizeSearch("ni");
  const rowNi = csv.nameToRow[keyNi];
  ok(!!rowNi, "resolve by key (ni)");
  ok(rowNi && rowNi.urls && rowNi.urls.length >= 1, "ni has urls");

  const matchedTw = getCardName("幫助卡", searchNames);
  const rowTw = matchedTw ? csv.nameToRow[matchedTw] : null;
  ok(!!rowTw, "resolve Traditional Chinese 幫助卡");
  ok(rowTw && rowTw.urls && rowTw.urls.length >= 1, "player aid row has urls from TW");

  const matchedCn = getCardName("帮助卡", searchNames);
  const rowCn = matchedCn ? csv.nameToRow[matchedCn] : null;
  ok(!!rowCn, "resolve Simplified Chinese 帮助卡");
  ok(rowCn && rowCn.urls && rowCn.urls.length >= 1, "player aid row has urls from CN");

  const withUrls = csv.rows.filter((r) => r.urls && r.urls.length > 0);
  ok(withUrls.length === csv.rows.length, "all rows have at least one image URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
