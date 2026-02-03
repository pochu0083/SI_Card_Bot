/**
 * Tests for major type in cards.csv: Chinese names and URL from card_db
 */

const path = require("path");
const csvLoader = require("../commands/loadCardCsv.js");
const { getCardName } = require("../commands/sendCardLink.js");

process.chdir(path.join(__dirname, ".."));

describe("Cards CSV major type (Chinese names + URL)", () => {
  let csv;

  beforeAll(() => {
    csv = csvLoader.loadCardCsv();
  });

  it("loads cards.csv and has major rows", () => {
    expect(csv.loaded).toBe(true);
    const majorRows = csv.rows.filter((r) => r.type === "major");
    expect(majorRows.length).toBeGreaterThan(0);
  });

  it("major rows have suisoko.com URLs after update", () => {
    const majorRows = csv.rows.filter((r) => r.type === "major");
    const withSuisoko = majorRows.filter((r) => r.url && r.url.includes("suisoko.com"));
    expect(withSuisoko.length).toBe(majorRows.length);
  });

  it("major rows have name_zh_tw and name_zh_cn", () => {
    const majorRows = csv.rows.filter((r) => r.type === "major");
    const withZh = majorRows.filter((r) => (r.name_zh_tw || r.name_zh_cn) && r.url && r.url.includes("suisoko.com"));
    expect(withZh.length).toBe(majorRows.length);
  });

  it("resolves Traditional Chinese major name to row with new URL", () => {
    const searchNames = csvLoader.getAllSearchNames("major");
    const matched = getCardName("雷霆利爪", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("major");
    expect(row.url).toContain("suisoko.com");
    expect(row.url).toContain("Major");
  });

  it("resolves Simplified Chinese major name to row", () => {
    const searchNames = csvLoader.getAllSearchNames("major");
    const matched = getCardName("力量风暴", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("major");
  });

  it("resolves English major name (slug) to row", () => {
    const searchNames = csvLoader.getAllSearchNames("major");
    const matched = getCardName("talons of lightning", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.name).toBe("talons_of_lightning");
    expect(row.url).toContain("suisoko.com");
  });

  it("flow_like_water_reach_like_air (comma in card_db) has Chinese and URL", () => {
    const row = csv.rows.find((r) => r.type === "major" && r.name === "flow_like_water_reach_like_air");
    expect(row).toBeDefined();
    expect(row.name_zh_tw).toBeTruthy();
    expect(row.name_zh_cn).toBeTruthy();
    expect(row.url).toContain("suisoko.com");
  });

  it("vanish_softly_away_forgotten_by_all (comma in card_db) has Chinese and URL", () => {
    const row = csv.rows.find((r) => r.type === "major" && r.name === "vanish_softly_away_forgotten_by_all");
    expect(row).toBeDefined();
    expect(row.name_zh_tw).toBeTruthy();
    expect(row.url).toContain("suisoko.com");
  });
});
