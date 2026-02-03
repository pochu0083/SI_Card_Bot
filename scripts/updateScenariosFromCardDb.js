/**
 * Update data/scenarios.csv from data/card_db.csv Scenario rows.
 * Each scenario has two rows in card_db: first (top) = front URL, second (bottom) = back URL.
 * Sets image_urls = frontUrl + ";" + backUrl, name_zh_tw, name_zh_cn.
 * Run from project root: node scripts/updateScenariosFromCardDb.js
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CARD_DB_PATH = path.join(DATA_DIR, "card_db.csv");
const SCENARIOS_PATH = path.join(DATA_DIR, "scenarios.csv");

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

/** Normalize for matching: lowercase, remove apostrophe, remove spaces and punctuation (keep alphanumeric). */
function normalizeScenarioName(s) {
  if (!s || typeof s !== "string") return "";
  return s
    .trim()
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9()]/g, "")
    .replace(/[()]/g, ""); // e.g. (NORMAL SURGES) -> normalsurges
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
  if (!fs.existsSync(SCENARIOS_PATH)) {
    console.error("Missing:", SCENARIOS_PATH);
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

  // Group Scenario rows by normalized name; collect URLs in order (first = front, second = back)
  const byNormalizedName = new Map(); // key -> { urls: [], name_zh_tw, name_zh_cn }
  for (let i = 1; i < cardDbLines.length; i++) {
    const fields = parseCsvLine(cardDbLines[i]);
    const type = typeIdx >= 0 ? (fields[typeIdx] || "").trim() : "";
    if (type !== "Scenario") continue;
    let eng = (fields[engIdx] || "").trim();
    const tw = (fields[twIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    if (!url) continue;
    eng = eng.replace(/\bPOWERSLON6\b/i, "POWERS LONG");
    const key = normalizeScenarioName(eng);
    if (!byNormalizedName.has(key)) {
      byNormalizedName.set(key, { urls: [], name_zh_tw: tw, name_zh_cn: twToCn(tw) });
    }
    byNormalizedName.get(key).urls.push(url);
  }

  // Build lookup: normalizedKey -> { frontUrl, backUrl, name_zh_tw, name_zh_cn }
  const scenarioFromDb = new Map();
  for (const [key, data] of byNormalizedName.entries()) {
    const urls = data.urls;
    if (urls.length >= 2) {
      scenarioFromDb.set(key, {
        frontUrl: urls[0],
        backUrl: urls[1],
        name_zh_tw: data.name_zh_tw,
        name_zh_cn: data.name_zh_cn,
      });
    }
  }

  // Map scenarios.csv name to card_db normalized key (special cases for Surges)
  function scenarioNameToDbKey(name, csvKey) {
    const n = normalizeScenarioName(name);
    if (csvKey === "SoC" || name === "Surges of Colonization") return "surgesofcolonizationnormalsurges";
    if (csvKey === "LSoC" || name === "Larger Surges") return "surgesofcolonizationlargersurges";
    return n;
  }

  const scenariosText = fs.readFileSync(SCENARIOS_PATH, "utf-8");
  const scenariosLines = scenariosText.split(/\r?\n/).filter((l) => l.trim());
  const scenHeader = parseCsvLine(scenariosLines[0]);
  const keyIdx = scenHeader.indexOf("key");
  const nameIdx = scenHeader.indexOf("name");
  const urlsIdx = scenHeader.indexOf("image_urls");
  const twIdx2 = scenHeader.indexOf("name_zh_tw");
  const cnIdx = scenHeader.indexOf("name_zh_cn");
  if (keyIdx === -1 || nameIdx === -1 || urlsIdx === -1) {
    console.error("scenarios.csv must have key, name, image_urls");
    process.exit(1);
  }

  const outLines = [scenariosLines[0]];
  let updated = 0;

  for (let i = 1; i < scenariosLines.length; i++) {
    const fields = parseCsvLine(scenariosLines[i]);
    const csvKey = (fields[keyIdx] || "").trim();
    const name = (fields[nameIdx] || "").trim();
    const dbKey = scenarioNameToDbKey(name, csvKey);
    const dbRow = scenarioFromDb.get(dbKey);

    if (!dbRow) {
      outLines.push(fields.map(escapeCsvField).join(","));
      continue;
    }

    const newFields = [...fields];
    newFields[urlsIdx] = dbRow.frontUrl + ";" + dbRow.backUrl;
    if (twIdx2 >= 0) newFields[twIdx2] = dbRow.name_zh_tw;
    if (cnIdx >= 0) newFields[cnIdx] = dbRow.name_zh_cn;
    outLines.push(newFields.map(escapeCsvField).join(","));
    updated++;
  }

  fs.writeFileSync(SCENARIOS_PATH, outLines.join("\n"), "utf-8");
  console.log("Updated", updated, "scenario rows in", SCENARIOS_PATH, "from card_db (image_urls = front;back, name_zh_tw, name_zh_cn).");
}

main();
