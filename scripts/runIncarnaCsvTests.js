/**
 * Standalone test runner for incarna.csv (image_urls; Chinese optional).
 * Run from project root: node scripts/runIncarnaCsvTests.js
 */

const path = require("path");

process.chdir(path.join(__dirname, ".."));

const namesCsv = require("../commands/loadNamesCsv.js");
const { loadIncarnaCsv } = namesCsv;
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
  console.log("Incarna CSV tests\n");

  const csv = loadIncarnaCsv();

  ok(csv.loaded, "incarna.csv loaded");
  ok(csv.rows.length >= 1, "has at least one incarna row");

  const searchNames = csv.getSearchNames();
  ok(searchNames.length > 0, "getSearchNames() returns names");

  const keyVoice = namesCsv.normalizeSearch("voice");
  const rowVoice = csv.nameToRow[keyVoice];
  ok(!!rowVoice, "resolve by key (voice)");
  ok(rowVoice && rowVoice.name && rowVoice.name.includes("Wandering Voice"), "voice name");
  ok(rowVoice && rowVoice.urls && rowVoice.urls.length >= 1, "voice has image_urls");

  const matchedBreath = getCardName("breath of darkness", searchNames);
  const rowBreath = matchedBreath ? csv.nameToRow[matchedBreath] : null;
  ok(!!rowBreath, "resolve by name (breath of darkness)");
  ok(rowBreath && rowBreath.urls && rowBreath.urls.length >= 1, "breath row has urls");

  const matchedLocus = getCardName("locus", searchNames);
  const rowLocus = matchedLocus ? csv.nameToRow[matchedLocus] : null;
  ok(!!rowLocus, "resolve by key (locus)");
  ok(rowLocus && rowLocus.urls && rowLocus.urls.length >= 1, "locus has urls");

  const withUrls = csv.rows.filter((r) => r.urls && r.urls.length > 0);
  ok(withUrls.length === csv.rows.length, "all rows have at least one image URL");

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
