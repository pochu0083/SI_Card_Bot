/**
 * Update data/reminder.csv from data/card_db.csv Reminder rows.
 * Rows with the same name are one card: first (top) = front, second (bottom) = back.
 * Sets image_urls = frontUrl + ";" + backUrl (or single url if one row per name).
 * Run from project root: node scripts/updateReminderFromCardDb.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CARD_DB_PATH = path.join(DATA_DIR, "card_db.csv");
const REMINDER_PATH = path.join(DATA_DIR, "reminder.csv");

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

/** Normalize reminder name for grouping: lowercase, collapse spaces. */
function normalizeName(s) {
  if (!s || typeof s !== "string") return "";
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

/** Slug for key column (e.g. "command beasts 1" -> "command_beasts_1"). */
function toKey(s) {
  if (!s || typeof s !== "string") return "";
  return s.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

/** Title-case for name column. */
function toTitleName(s) {
  if (!s || typeof s !== "string") return "";
  return s.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
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

  const cardDbText = fs.readFileSync(CARD_DB_PATH, "utf-8");
  const cardDbLines = cardDbText.split(/\r?\n/).filter((l) => l.trim());
  const dbHeader = parseCsvLine(cardDbLines[0]);
  const typeIdx = dbHeader.indexOf("Type");
  const engIdx = dbHeader.findIndex((h) => /english/i.test(h));
  const twIdx = dbHeader.findIndex((h) => /traditional/i.test(h));
  const urlIdx = dbHeader.indexOf("url");
  if (typeIdx === -1 || engIdx === -1 || twIdx === -1 || urlIdx === -1) {
    console.error("card_db.csv must have Type, English name, Traditional Chinese name, url");
    process.exit(1);
  }

  const byName = new Map(); // normalized name -> { urls: [], name_eng, name_zh_tw, name_zh_cn }
  for (let i = 1; i < cardDbLines.length; i++) {
    const fields = parseCsvLine(cardDbLines[i]);
    const type = (fields[typeIdx] || "").trim();
    if (type !== "Reminder") continue;
    const eng = (fields[engIdx] || "").trim();
    const tw = (fields[twIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    if (!url) continue;
    const key = normalizeName(eng);
    if (!byName.has(key)) {
      byName.set(key, { urls: [], name_eng: eng, name_zh_tw: tw, name_zh_cn: twToCn(tw) });
    }
    byName.get(key).urls.push(url);
  }

  const outRows = [];
  for (const [, data] of byName.entries()) {
    if (data.urls.length === 0) continue;
    outRows.push({
      key: toKey(data.name_eng) || data.name_eng.toLowerCase().replace(/\s+/g, "_"),
      name: toTitleName(data.name_eng),
      image_urls: data.urls.join(";"),
      name_zh_tw: data.name_zh_tw,
      name_zh_cn: data.name_zh_cn,
    });
  }

  const header = "key,name,image_urls,name_zh_tw,name_zh_cn";
  const outLines = [
    header,
    ...outRows.map((r) =>
      [r.key, r.name, r.image_urls, r.name_zh_tw, r.name_zh_cn].map(escapeCsvField).join(","),
    ),
  ];
  fs.writeFileSync(REMINDER_PATH, outLines.join("\n"), "utf-8");
  console.log("Wrote", outRows.length, "rows to", REMINDER_PATH, "from card_db (Reminder type; image_urls = front;back).");
}

main();
