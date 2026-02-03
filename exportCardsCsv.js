/**
 * One-time script: export current ImageNames data to data/cards.csv.
 * Run from project root: node exportCardsCsv.js
 */

const fs = require("fs");
const path = require("path");

const ImageNames = require("./commands/ImageNames.js");

const POWERS_BASE = "https://sick.oberien.de/imgs/powers/";
const EVENTS_BASE = "https://sick.oberien.de/imgs/events/";
const FEARS_BASE = "https://sick.oberien.de/imgs/fears/";
const BLIGHTS_BASE = "https://sick.oberien.de/imgs/blights/";

function row(name, url, type, aliases = [], name_zh_tw = "", name_zh_cn = "") {
  const aliasStr = aliases.length ? aliases.join(";") : "";
  return { name, url, type, aliases: aliasStr, name_zh_tw, name_zh_cn };
}

function escapeCsvField(s) {
  if (s == null) return "";
  const str = String(s).trim();
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function buildRows() {
  const rows = [];

  for (const name of ImageNames.unique) {
    rows.push(row(name, POWERS_BASE + name + ".webp", "unique"));
  }
  for (const name of ImageNames.minor) {
    rows.push(row(name, POWERS_BASE + name + ".webp", "minor"));
  }
  for (const name of ImageNames.major) {
    rows.push(row(name, POWERS_BASE + name + ".webp", "major"));
  }

  const eventAliasMap = {};
  for (const [aliasKey, cardValue] of Object.entries(ImageNames.eventAliases)) {
    const cards = Array.isArray(cardValue) ? cardValue : [cardValue];
    for (const cardName of cards) {
      if (!eventAliasMap[cardName]) eventAliasMap[cardName] = [];
      eventAliasMap[cardName].push(aliasKey);
    }
  }
  for (const name of ImageNames.event) {
    const aliases = eventAliasMap[name] || [];
    rows.push(row(name, EVENTS_BASE + name + ".webp", "event", aliases));
  }

  for (const name of ImageNames.fear) {
    rows.push(row(name, FEARS_BASE + name + ".webp", "fear"));
  }
  for (const name of ImageNames.allBlightCards) {
    rows.push(row(name, BLIGHTS_BASE + name + ".webp", "blight"));
  }

  return rows;
}

function main() {
  const rows = buildRows();
  const outDir = path.join(__dirname, "data");
  const outPath = path.join(outDir, "cards.csv");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const header = "name,url,type,aliases,name_zh_tw,name_zh_cn";
  const lines = [header];
  for (const r of rows) {
    lines.push(
      [
        escapeCsvField(r.name),
        escapeCsvField(r.url),
        escapeCsvField(r.type),
        escapeCsvField(r.aliases),
        escapeCsvField(r.name_zh_tw),
        escapeCsvField(r.name_zh_cn),
      ].join(",")
    );
  }
  fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
  console.log("Wrote", rows.length, "rows to", outPath);
}

main();
