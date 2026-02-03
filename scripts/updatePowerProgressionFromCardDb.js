/**
 * Update data/power_progression.csv from data/card_db.csv Progression rows.
 * Matches by normalized spirit name (English); sets url, name_zh_tw, name_zh_cn.
 * Run from project root: node scripts/updatePowerProgressionFromCardDb.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CARD_DB_PATH = path.join(DATA_DIR, "card_db.csv");
const PROGRESSION_PATH = path.join(DATA_DIR, "power_progression.csv");

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

/** Normalize spirit name for matching: lowercase, remove apostrophe, collapse spaces. */
function normalizeSpiritName(s) {
  if (!s || typeof s !== "string") return "";
  return s
    .trim()
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\s+/g, "");
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
  if (!fs.existsSync(PROGRESSION_PATH)) {
    console.error("Missing:", PROGRESSION_PATH);
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

  const byNormalizedName = new Map(); // normalized name -> { url, name_zh_tw, name_zh_cn }
  for (let i = 1; i < cardDbLines.length; i++) {
    const fields = parseCsvLine(cardDbLines[i]);
    const type = typeIdx >= 0 ? (fields[typeIdx] || "").trim() : "";
    if (type !== "Progression") continue;
    let eng = (fields[engIdx] || "").trim();
    const tw = (fields[twIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    if (!url) continue;
    eng = eng.replace(/,/g, " ");
    const key = normalizeSpiritName(eng);
    byNormalizedName.set(key, {
      url,
      name_zh_tw: tw,
      name_zh_cn: twToCn(tw),
    });
  }

  const progressionText = fs.readFileSync(PROGRESSION_PATH, "utf-8");
  const progressionLines = progressionText.split(/\r?\n/).filter((l) => l.trim());
  const progHeader = parseCsvLine(progressionLines[0]);
  const keyIdx = progHeader.indexOf("key");
  const nameIdx = progHeader.indexOf("name");
  const urlIdx2 = progHeader.indexOf("url");
  const twIdx2 = progHeader.indexOf("name_zh_tw");
  const cnIdx = progHeader.indexOf("name_zh_cn");
  if (nameIdx === -1 || urlIdx2 === -1) {
    console.error("power_progression.csv must have name, url");
    process.exit(1);
  }

  const outLines = [progressionLines[0]];
  let updated = 0;

  for (let i = 1; i < progressionLines.length; i++) {
    const fields = parseCsvLine(progressionLines[i]);
    const name = (fields[nameIdx] || "").trim();
    const dbKey = normalizeSpiritName(name);
    const dbRow = byNormalizedName.get(dbKey);

    if (!dbRow) {
      outLines.push(fields.map(escapeCsvField).join(","));
      continue;
    }

    const newFields = [...fields];
    while (newFields.length < progHeader.length) newFields.push("");
    newFields[urlIdx2] = dbRow.url;
    if (twIdx2 >= 0) newFields[twIdx2] = dbRow.name_zh_tw;
    if (cnIdx >= 0) newFields[cnIdx] = dbRow.name_zh_cn;
    outLines.push(newFields.map(escapeCsvField).join(","));
    updated++;
  }

  fs.writeFileSync(PROGRESSION_PATH, outLines.join("\n"), "utf-8");
  console.log("Updated", updated, "rows in", PROGRESSION_PATH, "from card_db (url, name_zh_tw, name_zh_cn).");
}

main();
