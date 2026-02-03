/**
 * Tests for fear type in cards.csv: Chinese names and URL from card_db
 */

const path = require("path");
const csvLoader = require("../commands/loadCardCsv.js");
const { getCardName } = require("../commands/sendCardLink.js");

process.chdir(path.join(__dirname, ".."));

describe("Cards CSV fear type (Chinese names + URL)", () => {
  let csv;

  beforeAll(() => {
    csv = csvLoader.loadCardCsv();
  });

  it("loads cards.csv and has fear rows", () => {
    expect(csv.loaded).toBe(true);
    const fearRows = csv.rows.filter((r) => r.type === "fear");
    expect(fearRows.length).toBeGreaterThan(0);
  });

  it("fear rows have suisoko.com URLs after update", () => {
    const fearRows = csv.rows.filter((r) => r.type === "fear");
    const withSuisoko = fearRows.filter((r) => r.url && r.url.includes("suisoko.com"));
    expect(withSuisoko.length).toBe(fearRows.length);
  });

  it("fear rows have name_zh_tw and name_zh_cn", () => {
    const fearRows = csv.rows.filter((r) => r.type === "fear");
    const withZh = fearRows.filter((r) => (r.name_zh_tw || r.name_zh_cn) && r.url && r.url.includes("suisoko.com"));
    expect(withZh.length).toBe(fearRows.length);
  });

  it("resolves Traditional Chinese fear name to row with new URL", () => {
    const searchNames = csvLoader.getAllSearchNames("fear");
    const matched = getCardName("目不可視的恐懼", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("fear");
    expect(row.url).toContain("suisoko.com");
    expect(row.url).toContain("Fear");
  });

  it("resolves Simplified Chinese fear name to row", () => {
    const searchNames = csvLoader.getAllSearchNames("fear");
    const matched = getCardName("目不可视的恐惧", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("fear");
  });

  it("resolves English fear name (slug) to row", () => {
    const searchNames = csvLoader.getAllSearchNames("fear");
    const matched = getCardName("fear of the unseen", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.name).toBe("fear_of_the_unseen");
    expect(row.url).toContain("suisoko.com");
  });

  it("overseas_trade_seem_safer (typo) row has Chinese and URL", () => {
    const row = csv.rows.find((r) => r.type === "fear" && r.name === "overseas_trade_seem_safer");
    expect(row).toBeDefined();
    expect(row.name_zh_tw).toBeTruthy();
    expect(row.name_zh_cn).toBeTruthy();
    expect(row.url).toContain("suisoko.com");
  });
});
