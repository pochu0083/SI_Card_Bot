/**
 * Tests for -event command: cards.csv event type, Chinese name/alias, URL from card_db
 */

const path = require("path");
const csvLoader = require("../commands/loadCardCsv.js");
const { getCardName } = require("../commands/sendCardLink.js");

process.chdir(path.join(__dirname, ".."));

describe("Cards CSV event type (Chinese names + aliases + URL)", () => {
  let csv;

  beforeAll(() => {
    csv = csvLoader.loadCardCsv();
  });

  it("loads cards.csv and has event rows", () => {
    expect(csv.loaded).toBe(true);
    const eventRows = csv.rows.filter((r) => r.type === "event");
    expect(eventRows.length).toBeGreaterThan(0);
  });

  it("event search supports semicolon-separated aliases column", () => {
    const eventRows = csv.rows.filter((r) => r.type === "event");
    const withAliases = eventRows.filter((r) => r.aliases && r.aliases.length > 0);
    expect(withAliases.length).toBeGreaterThan(0);
    const row = withAliases.find((r) => r.aliases.includes("the_center_crumbles"));
    expect(row).toBeDefined();
    expect(row.name).toBe("putting_down_roots");
  });

  it("resolves Traditional Chinese event name to row with new URL", () => {
    const searchNames = csvLoader.getAllSearchNames("event");
    const matched = getCardName("奴隸起義", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("event");
    expect(row.url).toContain("suisoko.com");
    expect(row.url).toContain("Event");
  });

  it("resolves Simplified Chinese event name to row", () => {
    const searchNames = csvLoader.getAllSearchNames("event");
    const matched = getCardName("奴隶起义", searchNames);
    expect(matched).toBeTruthy();
    const row = csv.nameToRow[matched] || (csv.aliasToRows[matched] && csv.aliasToRows[matched][0]);
    expect(row).toBeDefined();
    expect(row.type).toBe("event");
  });

  it("resolves Chinese alias (aliases_zh_tw/cn) to event row", () => {
    const searchNames = csvLoader.getAllSearchNames("event");
    const matched = getCardName("内地崩潰", searchNames);
    expect(matched).toBeTruthy();
    const rows = csv.aliasToRows[matched];
    expect(rows).toBeDefined();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].name).toBe("putting_down_roots");
    expect(rows[0].url).toContain("suisoko.com");
  });

  it("event row has aliases_zh_tw/aliases_zh_cn when present", () => {
    const eventRows = csv.rows.filter((r) => r.type === "event");
    const withZhAliases = eventRows.filter(
      (r) => (r.aliases_zh_tw && r.aliases_zh_tw.length > 0) || (r.aliases_zh_cn && r.aliases_zh_cn.length > 0),
    );
    expect(withZhAliases.length).toBeGreaterThan(0);
  });
});
