/**
 * Update data/cards.csv unique rows from data/card_db.csv Unique:
 * - Single English name and Traditional Chinese name per row
 * - url from card_db; name_zh_cn from Traditional via twToCn
 * Run from project root: node scripts/updateCardsUniqueFromCardDb.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CARD_DB_PATH = path.join(DATA_DIR, "card_db.csv");
const CARDS_PATH = path.join(DATA_DIR, "cards.csv");

function parseCsvLine(line) {
  const fields = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let end = i + 1;
      while (end < line.length) {
        const next = line.indexOf('"', end);
        if (next === -1) {
          end = line.length;
          break;
        }
        if (line[next + 1] === '"') {
          end = next + 2;
          continue;
        }
        end = next;
        break;
      }
      fields.push(line.slice(i + 1, end).replace(/""/g, '"'));
      i = end + 1;
      if (line[i] === ",") i++;
    } else {
      let end = line.indexOf(",", i);
      if (end === -1) end = line.length;
      fields.push(line.slice(i, end).trim());
      i = end + 1;
    }
  }
  return fields;
}

function englishToSlug(s) {
  if (!s || typeof s !== "string") return "";
  return s
    .trim()
    .toLowerCase()
    .replace(/-/g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, "_");
}

function normalizeToComparable(s) {
  if (!s || typeof s !== "string") return "";
  return s.toLowerCase().replace(/_/g, "");
}

const T2S_MAP = {
  蘭: "兰", 國: "国", 蘇: "苏", 爾: "尔", 羅: "罗", 魯: "鲁", 礦: "矿",
  產: "产", 調: "调", 農: "农", 業: "业", 陟: "队", 酉: "西", 土: "土",
};

function twToCn(text) {
  if (!text || typeof text !== "string") return "";
  const s = text.trim();
  try {
    const OpenCC = require("opencc-js");
    const converter = OpenCC.Converter({ from: "tw", to: "cn" });
    return converter(s);
  } catch (e) {
    return s.split("").map((c) => T2S_MAP[c] || c).join("");
  }
}

function escapeCsvField(f) {
  const s = String(f == null ? "" : f);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function main() {
  if (!fs.existsSync(CARD_DB_PATH)) {
    console.error("Missing:", CARD_DB_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(CARDS_PATH)) {
    console.error("Missing:", CARDS_PATH);
    process.exit(1);
  }

  const cardDbText = fs.readFileSync(CARD_DB_PATH, "utf-8");
  const cardDbLines = cardDbText.split(/\r?\n/).filter((l) => l.trim());
  const dbHeader = parseCsvLine(cardDbLines[0]);
  const typeIdx = dbHeader.indexOf("Type");
  const engIdx = dbHeader.findIndex((h) => /english/i.test(h));
  const twIdx = dbHeader.findIndex((h) => /traditional/i.test(h));
  const urlIdx = dbHeader.indexOf("url");
  if (engIdx === -1 || twIdx === -1 || urlIdx === -1) {
    console.error("card_db.csv must have English name, Traditional Chinese name, url");
    process.exit(1);
  }

  const uniqueRowsFromDb = [];
  for (let i = 1; i < cardDbLines.length; i++) {
    const fields = parseCsvLine(cardDbLines[i]);
    const type = typeIdx >= 0 ? (fields[typeIdx] || "").trim() : "";
    if (type !== "Unique") continue;
    let eng = (fields[engIdx] || "").trim();
    const tw = (fields[twIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    if (!url) continue;
    // card_db uses comma in "X, Y" -> treat as space for slug
    eng = eng.replace(/,/g, " ");
    const slug = englishToSlug(eng);
    const key = normalizeToComparable(slug);
    const row = {
      key,
      url,
      name_zh_tw: tw,
      name_zh_cn: twToCn(tw),
    };
    uniqueRowsFromDb.push(row);
  }

  const byKey = new Map();
  for (const row of uniqueRowsFromDb) {
    if (!byKey.has(row.key)) byKey.set(row.key, row);
  }

  const cardsText = fs.readFileSync(CARDS_PATH, "utf-8");
  const cardsLines = cardsText.split(/\r?\n/).filter((l) => l.trim());
  const cardsHeader = parseCsvLine(cardsLines[0]);
  const cNameIdx = cardsHeader.indexOf("name");
  const cUrlIdx = cardsHeader.indexOf("url");
  const cTypeIdx = cardsHeader.indexOf("type");
  const cNameZhTwIdx = cardsHeader.indexOf("name_zh_tw");
  const cNameZhCnIdx = cardsHeader.indexOf("name_zh_cn");

  const outLines = [cardsLines[0]];
  let updated = 0;

  for (let i = 1; i < cardsLines.length; i++) {
    const fields = parseCsvLine(cardsLines[i]);
    const type = cTypeIdx >= 0 ? (fields[cTypeIdx] || "").trim() : "";
    if (type !== "unique") {
      outLines.push(fields.map(escapeCsvField).join(","));
      continue;
    }

    const name = (fields[cNameIdx] || "").trim();
    const cardKey = normalizeToComparable(name);
    const dbRow = byKey.get(cardKey);
    if (!dbRow) {
      outLines.push(fields.map(escapeCsvField).join(","));
      continue;
    }

    const newFields = [...fields];
    while (newFields.length < cardsHeader.length) newFields.push("");
    if (cUrlIdx >= 0) newFields[cUrlIdx] = dbRow.url;
    if (cNameZhTwIdx >= 0) newFields[cNameZhTwIdx] = dbRow.name_zh_tw;
    if (cNameZhCnIdx >= 0) newFields[cNameZhCnIdx] = dbRow.name_zh_cn;
    outLines.push(newFields.map(escapeCsvField).join(","));
    updated++;
  }

  fs.writeFileSync(CARDS_PATH, outLines.join("\n"), "utf-8");
  console.log("Updated", updated, "unique rows in", CARDS_PATH, "from card_db (url, name_zh_tw, name_zh_cn).");
}

main();
