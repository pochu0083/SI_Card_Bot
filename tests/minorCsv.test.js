/**
 * Tests for minor type in cards.csv: Chinese names and URL from card_db
 */

const path = require("path");
const csvLoader = require("../commands/loadCardCsv.js");
const { getCardName } = require("../commands/sendCardLink.js");

process.chdir(path.join(__dirname, ".."));

describe("Cards CSV minor type (Chinese names + URL)", () => {
  let csv;

  beforeAll(() => {
    csv = csvLoader.loadCardCsv();
  });

  it("loads cards.csv and has minor rows", () => {
    expect(csv.loaded).toBe(true);
    const minorRows = csv.rows.filter((r) => r.type === "minor");
    expect(minorRows.length).toBeGreaterThan(0);
  });

  it("most minor rows have suisoko.com URLs after update", () => {
    const minorRows = csv.rows.filter((r) => r.type === "minor");
    const withSuisoko = minorRows.filter((r) => r.url && r.url.includes("suisoko.com"));
    expect(withSuisoko.length).toBeGreaterThanOrEqual(100);
  });

  it("minor rows with suisoko have name_zh_tw and name_zh_cn", () => {
    const minorRows = csv.rows.filter((r) => r.type === "minor" && r.url && r.url.includes("suisoko.com"));
    const withZh = minorRows.filter((r) => r.name_zh_tw || r.name_zh_cn);
    expect(withZh.length).toBe(minorRows.length);
  });

  it("resolves Traditional Chinese minor name to row with new URL", () => {
    const searchNames = csvLoader.getAllSearchNames("minor");
    const matched = getCardName("兇猛裂齒獸", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("minor");
    expect(row.url).toContain("suisoko.com");
    expect(row.url).toContain("Minor");
  });

  it("resolves Simplified Chinese minor name to row", () => {
    const searchNames = csvLoader.getAllSearchNames("minor");
    const matched = getCardName("凶猛裂齿兽", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("minor");
  });

  it("resolves English minor name (slug) to row", () => {
    const searchNames = csvLoader.getAllSearchNames("minor");
    const matched = getCardName("savage mawbeasts", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.name).toBe("savage_mawbeasts");
    expect(row.url).toContain("suisoko.com");
  });

  it("twilight_fog_brings_madness (card_db FO6 typo) has Chinese and URL", () => {
    const row = csv.rows.find((r) => r.type === "minor" && r.name === "twilight_fog_brings_madness");
    expect(row).toBeDefined();
    expect(row.name_zh_tw).toBeTruthy();
    expect(row.url).toContain("suisoko.com");
  });
});
