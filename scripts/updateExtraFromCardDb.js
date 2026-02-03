/**
 * Update data/extra.csv from data/card_db.csv Extra rows.
 * Builds extra.csv from card_db Type=Extra: one row per spirit (key, name, url, name_zh_tw, name_zh_cn).
 * Run from project root: node scripts/updateExtraFromCardDb.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CARD_DB_PATH = path.join(DATA_DIR, "card_db.csv");
const EXTRA_PATH = path.join(DATA_DIR, "extra.csv");

/** card_db folder name (after Spirits\) -> extra.csv key */
const FOLDER_TO_KEY = {
  Darkness: "Breath",
  Gleaming_Shards: "Gleaming_Shards",
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

/** Title-case English name for display (e.g. "BREATH OF DARKNESS" -> "Breath of Darkness"). */
function toTitleName(s) {
  if (!s || typeof s !== "string") return "";
  return s
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

function folderToKey(folderStr) {
  if (!folderStr || typeof folderStr !== "string") return "";
  const name = folderStr.replace(/^Spirits[\\/]/, "").trim();
  return FOLDER_TO_KEY[name] || name;
}

function main() {
  if (!fs.existsSync(CARD_DB_PATH)) {
    console.error("Missing:", CARD_DB_PATH);
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

  const rows = [];
  for (let i = 1; i < cardDbLines.length; i++) {
    const fields = parseCsvLine(cardDbLines[i]);
    const type = typeIdx >= 0 ? (fields[typeIdx] || "").trim() : "";
    if (type !== "Extra") continue;
    const folder = (fields[folderIdx] || "").trim();
    let eng = (fields[engIdx] || "").trim();
    const tw = (fields[twIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    if (!url) continue;
    eng = eng.replace(/,/g, " ");
    const key = folderToKey(folder);
    const name = toTitleName(eng);
    rows.push({
      key: key || folder.replace(/^Spirits[\\/]/, ""),
      name,
      url,
      name_zh_tw: tw,
      name_zh_cn: twToCn(tw),
    });
  }

  const header = "key,name,url,name_zh_tw,name_zh_cn";
  const outLines = [
    header,
    ...rows.map((r) =>
      [r.key, r.name, r.url, r.name_zh_tw, r.name_zh_cn].map(escapeCsvField).join(","),
    ),
  ];
  fs.writeFileSync(EXTRA_PATH, outLines.join("\n"), "utf-8");
  console.log("Wrote", rows.length, "rows to", EXTRA_PATH, "from card_db (Extra type).");
}

main();
