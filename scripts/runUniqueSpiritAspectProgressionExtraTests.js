/**
 * Standalone test runner for unique (cards.csv), spirit, aspect, progression, and extra CSVs.
 * Run from project root: node scripts/runUniqueSpiritAspectProgressionExtraTests.js
 */

const path = require("path");

process.chdir(path.join(__dirname, ".."));

const csvLoader = require("../commands/loadCardCsv.js");
const namesCsv = require("../commands/loadNamesCsv.js");
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
  console.log("Unique (cards.csv) tests\n");

  const cards = csvLoader.loadCardCsv();
  ok(cards.loaded, "cards.csv loaded");
  const uniqueRows = csvLoader.getRowsByType("unique");
  ok(uniqueRows.length > 0, "has unique rows");
  const searchNamesUnique = csvLoader.getAllSearchNames("unique");
  const matchedUnique = getCardName("fields choked with growth", searchNamesUnique);
  const rowUnique = matchedUnique ? cards.nameToRow[matchedUnique] || (cards.aliasToRows[matchedUnique] && cards.aliasToRows[matchedUnique][0]) : null;
  ok(!!rowUnique, "resolve unique by English (fields choked with growth)");
  ok(rowUnique && rowUnique.url, "unique row has url");

  console.log("\nSpirit (spirits.csv) tests\n");

  const spirits = namesCsv.loadSpiritsCsv();
  ok(spirits.loaded, "spirits.csv loaded");
  const spiritNames = spirits.getSearchNames();
  const matchedSpirit = getCardName("lightning", spiritNames);
  const rowSpirit = matchedSpirit ? spirits.nameToRow[matchedSpirit] : null;
  ok(!!rowSpirit, "resolve spirit by name (lightning)");
  ok(rowSpirit && rowSpirit.urls && rowSpirit.urls.length > 0, "spirit row has image_urls");

  console.log("\nAspect (aspects.csv) tests\n");

  const aspects = namesCsv.loadAspectsCsv();
  ok(aspects.loaded, "aspects.csv loaded");
  const aspectSearchNames = aspects.getSearchNames();
  const matchedAspect = getCardName("sparking", aspectSearchNames);
  const aspectRow = matchedAspect
    ? (aspects.nameToRow[matchedAspect] || (aspects.aliasToRows[matchedAspect] && aspects.aliasToRows[matchedAspect][0]))
    : null;
  ok(!!aspectRow, "resolve aspect by name (sparking)");
  const aspectHasUrls = aspectRow && (aspectRow.urls?.length > 0 || (aspectRow.image_urls && aspectRow.image_urls.split(";").filter(Boolean).length > 0));
  ok(aspectHasUrls, "aspect row has image_urls");

  console.log("\nProgression (power_progression.csv) tests\n");

  const progression = namesCsv.loadPowerProgressionCsv();
  ok(progression.loaded, "power_progression.csv loaded");
  const progNames = progression.getSearchNames();
  const matchedProg = getCardName("lightning", progNames);
  const rowProg = matchedProg ? progression.nameToRow[matchedProg] : null;
  ok(!!rowProg, "resolve progression by spirit name (lightning)");
  ok(rowProg && rowProg.url, "progression row has url");

  console.log("\nExtra (extra.csv) tests\n");

  const extra = namesCsv.loadExtraCsv();
  if (extra.loaded) {
    const extraNames = extra.getSearchNames();
    ok(extraNames.length > 0, "extra.csv has search names");
    const matchedExtra = getCardName("breath", extraNames);
    const rowExtra = matchedExtra ? extra.nameToRow[matchedExtra] : null;
    ok(!!rowExtra || extra.rows.length === 0, "resolve extra by name or no rows");
    if (rowExtra) ok(rowExtra.url, "extra row has url");
  } else {
    ok(true, "extra.csv not loaded (no data rows is ok)");
  }

  console.log("\n" + passed + " passed, " + failed + " failed");
  process.exit(failed > 0 ? 1 : 0);
}

main();
