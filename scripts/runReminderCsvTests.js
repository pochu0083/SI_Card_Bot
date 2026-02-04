/**
 * Standalone test runner for reminder.csv (Chinese + image_urls).
 * Run from project root: node scripts/runReminderCsvTests.js
 */

const path = require("path");

process.chdir(path.join(__dirname, ".."));

const namesCsv = require("../commands/loadNamesCsv.js");
const { loadReminderCsv } = namesCsv;
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
  console.log("Reminder CSV tests\n");

  const csv = loadReminderCsv();

  ok(csv.loaded, "reminder.csv loaded");
  ok(csv.rows.length >= 1, "has at least one reminder row");

  const searchNames = csv.getSearchNames();
  ok(searchNames.length > 0, "getSearchNames() returns names");

  const matchedAdversary = getCardName("adversary", searchNames);
  const rowAdversary = matchedAdversary ? csv.nameToRow[matchedAdversary] : null;
  ok(!!rowAdversary, "resolve by key (adversary)");
  ok(rowAdversary && rowAdversary.urls && rowAdversary.urls.length >= 1, "adversary row has urls");

  const matchedCommandBeasts = getCardName("command beasts 1", searchNames);
  const rowCommandBeasts = matchedCommandBeasts ? csv.nameToRow[matchedCommandBeasts] : null;
  ok(!!rowCommandBeasts, "resolve by name (Command Beasts 1)");
  ok(rowCommandBeasts && rowCommandBeasts.urls && rowCommandBeasts.urls.some((u) => u.includes("suisoko.com")), "Command Beasts 1 has suisoko URL");

  const matchedTw = getCardName("敵對勢力", searchNames);
  const rowTw = matchedTw ? csv.nameToRow[matchedTw] : null;
  ok(!!rowTw, "resolve Traditional Chinese 敵對勢力");
  ok(rowTw && rowTw.name === "Adversary", "Adversary row from TW");

  const matchedCn = getCardName("操控野兽 1", searchNames);
  const rowCn = matchedCn ? csv.nameToRow[matchedCn] : null;
  ok(!!rowCn, "resolve Simplified Chinese 操控野兽 1");
  ok(rowCn && rowCn.urls && rowCn.urls.length >= 1, "reminder row has urls from CN");

  const withUrls = csv.rows.filter((r) => r.urls && r.urls.length > 0);
  ok(withUrls.length === csv.rows.length, "all rows have at least one image URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
