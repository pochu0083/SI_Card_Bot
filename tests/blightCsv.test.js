/**
 * Tests for blight type in cards.csv: Chinese names and URL from card_db
 */

const path = require("path");
const csvLoader = require("../commands/loadCardCsv.js");
const { getCardName } = require("../commands/sendCardLink.js");

process.chdir(path.join(__dirname, ".."));

describe("Cards CSV blight type (Chinese names + URL)", () => {
  let csv;

  beforeAll(() => {
    csv = csvLoader.loadCardCsv();
  });

  it("loads cards.csv and has blight rows", () => {
    expect(csv.loaded).toBe(true);
    const blightRows = csv.rows.filter((r) => r.type === "blight");
    expect(blightRows.length).toBeGreaterThan(0);
  });

  it("blight rows have suisoko.com URLs after update", () => {
    const blightRows = csv.rows.filter((r) => r.type === "blight");
    const withSuisoko = blightRows.filter((r) => r.url && r.url.includes("suisoko.com"));
    expect(withSuisoko.length).toBe(blightRows.length);
  });

  it("blight rows have name_zh_tw and name_zh_cn", () => {
    const blightRows = csv.rows.filter((r) => r.type === "blight");
    const withZh = blightRows.filter((r) => (r.name_zh_tw || r.name_zh_cn) && r.url && r.url.includes("suisoko.com"));
    expect(withZh.length).toBe(blightRows.length);
  });

  it("resolves Traditional Chinese blight name to row with new URL", () => {
    const searchNames = csvLoader.getAllSearchNames("blight");
    const matched = getCardName("惡性循還", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("blight");
    expect(row.url).toContain("suisoko.com");
    expect(row.url).toContain("Blight");
  });

  it("resolves Simplified Chinese blight name to row", () => {
    const searchNames = csvLoader.getAllSearchNames("blight");
    const matched = getCardName("恶性循还", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("blight");
  });

  it("resolves English blight name (slug) to row", () => {
    const searchNames = csvLoader.getAllSearchNames("blight");
    const matched = getCardName("downward spiral", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.name).toBe("downward_spiral");
    expect(row.url).toContain("suisoko.com");
  });

  it("the_border_of_live_and_death (typo) row has Chinese and URL", () => {
    const row = csv.rows.find((r) => r.type === "blight" && r.name === "the_border_of_live_and_death");
    expect(row).toBeDefined();
    expect(row.name_zh_tw).toBeTruthy();
    expect(row.name_zh_cn).toBeTruthy();
    expect(row.url).toContain("suisoko.com");
  });
});
