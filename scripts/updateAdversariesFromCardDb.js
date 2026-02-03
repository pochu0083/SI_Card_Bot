/**
 * Update data/adversaries.csv from data/card_db.csv rows 3–10:
 * - Traditional Chinese name (name_zh_tw)
 * - Image URL (image_urls)
 * - Simplified Chinese (name_zh_cn) from Traditional via opencc-js
 * Run from project root: node scripts/updateAdversariesFromCardDb.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CARD_DB_PATH = path.join(DATA_DIR, "card_db.csv");
const ADVERSARIES_PATH = path.join(DATA_DIR, "adversaries.csv");

// card_db rows 3–10 (0-indexed lines 2–9) map to adversary keys in this order
const CARD_DB_ROW_TO_KEY = [
  "habsburg_mining",   // row 3
  "england",           // row 4
  "scotland",          // row 5
  "france",            // row 6
  "habsburg_livestock", // row 7
  "russia",            // row 8
  "prussia",           // row 9
  "sweden",            // row 10
];

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

// Minimal Traditional → Simplified map for adversary names (used if opencc-js not installed)
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

function main() {
  if (!fs.existsSync(CARD_DB_PATH)) {
    console.error("Missing:", CARD_DB_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(ADVERSARIES_PATH)) {
    console.error("Missing:", ADVERSARIES_PATH);
    process.exit(1);
  }

  const cardDbText = fs.readFileSync(CARD_DB_PATH, "utf-8");
  const cardDbLines = cardDbText.split(/\r?\n/).filter((l) => l.trim());
  const header = parseCsvLine(cardDbLines[0]);
  const engIdx = header.findIndex((h) => /english/i.test(h));
  const twIdx = header.findIndex((h) => /traditional/i.test(h));
  const urlIdx = header.findIndex((h) => h === "url");
  if (engIdx === -1 || twIdx === -1 || urlIdx === -1) {
    console.error("card_db.csv must have columns: English name, Traditional Chinese name, url");
    process.exit(1);
  }

  const updatesByKey = {};
  for (let i = 0; i < CARD_DB_ROW_TO_KEY.length; i++) {
    const lineIdx = 2 + i; // card_db row 3 = line index 2
    if (lineIdx >= cardDbLines.length) break;
    const fields = parseCsvLine(cardDbLines[lineIdx]);
    const key = CARD_DB_ROW_TO_KEY[i];
    const nameZhTw = (fields[twIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    if (!url) continue;
    updatesByKey[key] = {
      name_zh_tw: nameZhTw,
      name_zh_cn: twToCn(nameZhTw),
      image_urls: url,
    };
  }

  const advText = fs.readFileSync(ADVERSARIES_PATH, "utf-8");
  const advLines = advText.split(/\r?\n/).filter((l) => l.trim());
  const advHeader = parseCsvLine(advLines[0]);
  const keyIdx = advHeader.indexOf("key");
  const nameIdx = advHeader.indexOf("name");
  const urlsIdx = advHeader.indexOf("image_urls");
  const twColIdx = advHeader.indexOf("name_zh_tw");
  const cnColIdx = advHeader.indexOf("name_zh_cn");
  if (keyIdx === -1 || nameIdx === -1) {
    console.error("adversaries.csv must have key and name columns");
    process.exit(1);
  }

  function escapeCsvField(f) {
    const s = String(f == null ? "" : f);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  const outLines = [advLines[0]];
  for (let i = 1; i < advLines.length; i++) {
    const fields = parseCsvLine(advLines[i]);
    const key = (fields[keyIdx] || "").trim();
    const u = updatesByKey[key];
    if (u) {
      const newFields = [...fields];
      while (newFields.length < advHeader.length) newFields.push("");
      if (urlsIdx >= 0) newFields[urlsIdx] = u.image_urls;
      if (twColIdx >= 0) newFields[twColIdx] = u.name_zh_tw;
      if (cnColIdx >= 0) newFields[cnColIdx] = u.name_zh_cn;
      outLines.push(newFields.map(escapeCsvField).join(","));
    } else {
      outLines.push(advLines[i]);
    }
  }

  fs.writeFileSync(ADVERSARIES_PATH, outLines.join("\n"), "utf-8");
  console.log("Updated", ADVERSARIES_PATH, "with Traditional/Simplified Chinese and new image URLs from card_db rows 3–10.");
}

main();
