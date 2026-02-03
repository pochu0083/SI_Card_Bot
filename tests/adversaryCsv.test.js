/**
 * Tests for -adversary command: Chinese name resolution and image URL from data/adversaries.csv
 */

const path = require("path");
const namesCsv = require("../commands/loadNamesCsv.js");
const { loadAdversariesCsv } = namesCsv;
const { getCardName } = require("../commands/sendCardLink.js");

describe("Adversaries CSV (Chinese names + image URLs)", () => {
  let csv;

  beforeAll(() => {
    csv = loadAdversariesCsv();
  });

  it("loads adversaries.csv with 8 rows", () => {
    expect(csv.loaded).toBe(true);
    expect(csv.rows.length).toBe(8);
  });

  it("resolves English key to row with new image URL", () => {
    const key = namesCsv.normalizeSearch("prussia");
    const row = csv.nameToRow[key];
    expect(row).toBeDefined();
    expect(row.name).toBe("The Kingdom of Brandenburg-Prussia");
    expect(row.urls).toBeDefined();
    expect(row.urls.length).toBeGreaterThan(0);
    expect(row.urls[0]).toContain("suisoko.com");
    expect(row.urls[0]).toContain("Prussia");
  });

  it("resolves Traditional Chinese (瑞典王國) to Sweden row with new URL", () => {
    const searchNames = csv.getSearchNames();
    const matched = getCardName("瑞典王國", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched];
    expect(row).toBeDefined();
    expect(row.name).toBe("The Kingdom of Sweden");
    expect(row.urls[0]).toContain("suisoko.com");
    expect(row.urls[0]).toContain("Sweden");
  });

  it("resolves Simplified Chinese (瑞典王国) to Sweden row with new URL", () => {
    const searchNames = csv.getSearchNames();
    const matched = getCardName("瑞典王国", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched];
    expect(row).toBeDefined();
    expect(row.name).toBe("The Kingdom of Sweden");
    expect(row.urls[0]).toContain("suisoko.com");
  });

  it("resolves Traditional Chinese (英格蘭王國) to England with new URL", () => {
    const searchNames = csv.getSearchNames();
    const matched = getCardName("英格蘭王國", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched];
    expect(row).toBeDefined();
    expect(row.name).toBe("The Kingdom of England");
    expect(row.urls[0]).toContain("suisoko.com");
    expect(row.urls[0]).toContain("England");
  });

  it("resolves Traditional Chinese (俄羅斯沙皇國) to Russia with new URL", () => {
    const searchNames = csv.getSearchNames();
    const matched = getCardName("俄羅斯沙皇國", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched];
    expect(row).toBeDefined();
    expect(row.name).toBe("The Tsardom of Russia");
    expect(row.urls[0]).toContain("suisoko.com");
    expect(row.urls[0]).toContain("Tsardom");
  });

  it("resolves English name to row with new URL", () => {
    const searchNames = csv.getSearchNames();
    const matched = getCardName("Habsburg Mining", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched];
    expect(row).toBeDefined();
    expect(row.key).toBe("habsburg_mining");
    expect(row.urls[0]).toContain("suisoko.com");
    expect(row.urls[0]).toContain("Habsburg_Mining");
  });

  it("all rows have non-empty image_urls from suisoko.com", () => {
    const baseUrl = "https://suisoko.com/Adversaries/";
    for (const row of csv.rows) {
      expect(row.urls).toBeDefined();
      expect(row.urls.length).toBeGreaterThan(0);
      expect(row.urls[0]).toContain("suisoko.com");
    }
  });
});
