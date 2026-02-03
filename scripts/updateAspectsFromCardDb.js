/**
 * Update data/aspects.csv from data/card_db.csv Aspect rows.
 * Groups by (spirit, aspect name); multiple URLs per aspect are joined as image_urls (semicolon-separated).
 * Sets image_urls, name_zh_tw, name_zh_cn.
 * Run from project root: node scripts/updateAspectsFromCardDb.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CARD_DB_PATH = path.join(DATA_DIR, "card_db.csv");
const ASPECTS_PATH = path.join(DATA_DIR, "aspects.csv");

/** card_db folder name (after Spirits\) -> aspects.csv spirit column */
const FOLDER_TO_SPIRIT = {
  Rampant_Green: "Green",
  Mist: "Mists",
  Shadow: "Shadows",
  Sharp_Fang: "Fangs",
  Wild_Fire: "Wildfire",
};

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

/** Normalize aspect name for matching: lowercase, collapse spaces. */
function normalizeAspectName(s) {
  if (!s || typeof s !== "string") return "";
  return s.trim().toLowerCase().replace(/\s+/g, "");
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

function folderToSpirit(folderStr) {
  if (!folderStr || typeof folderStr !== "string") return "";
  const name = folderStr.replace(/^Spirits[\\/]/, "").trim();
  return FOLDER_TO_SPIRIT[name] || name;
}

function main() {
  if (!fs.existsSync(CARD_DB_PATH)) {
    console.error("Missing:", CARD_DB_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(ASPECTS_PATH)) {
    console.error("Missing:", ASPECTS_PATH);
    process.exit(1);
  }

  const cardDbText = fs.readFileSync(CARD_DB_PATH, "utf-8");
  const cardDbLines = cardDbText.split(/\r?\n/).filter((l) => l.trim());
  const dbHeader = parseCsvLine(cardDbLines[0]);
  const folderIdx = dbHeader.indexOf("folder");
  const typeIdx = dbHeader.indexOf("Type");
  const engIdx = dbHeader.findIndex((h) => /english/i.test(h));
  const twIdx = dbHeader.findIndex((h) => /traditional/i.test(h));
  const urlIdx = dbHeader.indexOf("url");
  if (folderIdx === -1 || typeIdx === -1 || engIdx === -1 || twIdx === -1 || urlIdx === -1) {
    console.error("card_db.csv must have folder, Type, English name, Traditional Chinese name, url");
    process.exit(1);
  }

  // Group Aspect rows by (spirit, normalized aspect name); collect URLs in order
  const byKey = new Map(); // key "spirit|aspectNorm" -> { urls: [], name_zh_tw, name_zh_cn }
  for (let i = 1; i < cardDbLines.length; i++) {
    const fields = parseCsvLine(cardDbLines[i]);
    const type = typeIdx >= 0 ? (fields[typeIdx] || "").trim() : "";
    if (type !== "Aspect") continue;
    const folder = (fields[folderIdx] || "").trim();
    let eng = (fields[engIdx] || "").trim();
    const tw = (fields[twIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    if (!url) continue;

    const spirit = folderToSpirit(folder);
    if (!spirit) continue;

    const aspectNorm = normalizeAspectName(eng);
    const key = spirit + "|" + aspectNorm;
    if (!byKey.has(key)) {
      byKey.set(key, {
        urls: [],
        name_zh_tw: tw,
        name_zh_cn: twToCn(tw),
      });
    }
    const entry = byKey.get(key);
    entry.urls.push(url);
    entry.name_zh_tw = tw;
    entry.name_zh_cn = twToCn(tw);
  }

  const aspectsText = fs.readFileSync(ASPECTS_PATH, "utf-8");
  const aspectsLines = aspectsText.split(/\r?\n/).filter((l) => l.trim());
  const aspectsHeader = parseCsvLine(aspectsLines[0]);
  const spiritIdx = aspectsHeader.indexOf("spirit");
  const nameIdx = aspectsHeader.indexOf("aspect_name");
  const urlsIdx = aspectsHeader.indexOf("image_urls");
  const twIdx2 = aspectsHeader.indexOf("name_zh_tw");
  const cnIdx = aspectsHeader.indexOf("name_zh_cn");
  if (spiritIdx === -1 || nameIdx === -1 || urlsIdx === -1) {
    console.error("aspects.csv must have spirit, aspect_name, image_urls");
    process.exit(1);
  }

  const outLines = [aspectsLines[0]];
  let updated = 0;

  for (let i = 1; i < aspectsLines.length; i++) {
    const fields = parseCsvLine(aspectsLines[i]);
    const spirit = (fields[spiritIdx] || "").trim();
    const aspectName = (fields[nameIdx] || "").trim();
    const key = spirit + "|" + normalizeAspectName(aspectName);
    const dbRow = byKey.get(key);

    if (!dbRow || !dbRow.urls.length) {
      outLines.push(fields.map(escapeCsvField).join(","));
      continue;
    }

    const newFields = [...fields];
    newFields[urlsIdx] = dbRow.urls.join(";");
    if (twIdx2 >= 0) newFields[twIdx2] = dbRow.name_zh_tw;
    if (cnIdx >= 0) newFields[cnIdx] = dbRow.name_zh_cn;
    outLines.push(newFields.map(escapeCsvField).join(","));
    updated++;
  }

  fs.writeFileSync(ASPECTS_PATH, outLines.join("\n"), "utf-8");
  console.log("Updated", updated, "aspect rows in", ASPECTS_PATH, "from card_db (image_urls, name_zh_tw, name_zh_cn).");
}

main();
