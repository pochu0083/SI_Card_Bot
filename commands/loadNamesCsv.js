/**
 * Load name CSVs (spirits, adversaries, aspects, scenarios, incarna) for Chinese
 * keyword support and image URLs. Same pattern as loadCardCsv: nameToRow and
 * aliasToRows for resolve; image_urls column holds semicolon-separated URLs.
 * CSV path: DATA_DIR env or ./data relative to project root.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(
  process.env.DATA_DIR || path.join(__dirname, "..", "data"),
);

function normalizeSearch(s) {
  if (s == null || typeof s !== "string") return "";
  return s.trim().replace(/\s+/g, "_").toLowerCase();
}

function parseCsvLine(line) {
  const fields = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let end = line.indexOf('"', i + 1);
      if (end === -1) end = line.length;
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

function parseImageUrls(imageUrlsStr) {
  if (!imageUrlsStr || typeof imageUrlsStr !== "string") return [];
  return imageUrlsStr.split(";").map((u) => u.trim()).filter(Boolean);
}

const cache = {};

/**
 * Generic loader for key,name,image_urls,name_zh_tw,name_zh_cn CSVs.
 * Returns { loaded, rows, nameToRow, aliasToRows, getSearchNames }.
 */
function loadKeyNameCsv(filename) {
  if (cache[filename]) return cache[filename];

  const resolved = path.join(DATA_DIR, filename);
  const result = {
    loaded: false,
    rows: [],
    nameToRow: {},
    aliasToRows: {},
    getSearchNames() {
      const names = new Set();
      for (const key of Object.keys(this.nameToRow)) names.add(key);
      for (const key of Object.keys(this.aliasToRows)) names.add(key);
      return Array.from(names);
    },
  };

  if (!fs.existsSync(resolved)) {
    cache[filename] = result;
    return result;
  }

  const text = fs.readFileSync(resolved, "utf-8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    cache[filename] = result;
    return result;
  }

  const header = parseCsvLine(lines[0]);
  const keyIdx = header.indexOf("key");
  const nameIdx = header.indexOf("name");
  const urlsIdx = header.indexOf("image_urls");
  const twIdx = header.indexOf("name_zh_tw");
  const cnIdx = header.indexOf("name_zh_cn");

  if (nameIdx === -1) {
    cache[filename] = result;
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const key = keyIdx >= 0 ? (fields[keyIdx] || "").trim() : "";
    const name = (fields[nameIdx] || "").trim();
    const imageUrlsStr = urlsIdx >= 0 ? (fields[urlsIdx] || "").trim() : "";
    const nameZhTw = twIdx >= 0 ? (fields[twIdx] || "").trim() : "";
    const nameZhCn = cnIdx >= 0 ? (fields[cnIdx] || "").trim() : "";

    if (!name) continue;

    const urls = parseImageUrls(imageUrlsStr);
    const row = {
      key,
      name,
      image_urls: imageUrlsStr,
      urls,
      name_zh_tw: nameZhTw,
      name_zh_cn: nameZhCn,
    };
    result.rows.push(row);

    const nKey = key ? normalizeSearch(key) : null;
    const nName = normalizeSearch(name);
    const nTw = nameZhTw ? normalizeSearch(nameZhTw) : null;
    const nCn = nameZhCn ? normalizeSearch(nameZhCn) : null;

    if (nKey) result.nameToRow[nKey] = row;
    result.nameToRow[nName] = row;
    if (nTw) result.nameToRow[nTw] = row;
    if (nCn) result.nameToRow[nCn] = row;
  }

  result.loaded = result.rows.length > 0;
  cache[filename] = result;
  return result;
}

/**
 * Aspects CSV: spirit, aspect_name, image_urls, name_zh_tw, name_zh_cn.
 * Search terms: "spirit aspect_name", aspect_name, Chinese. Multiple aspects
 * can share the same aspect name (e.g. Lair) -> aliasToRows for disambiguation.
 */
function loadAspectsCsv() {
  const key = "aspects.csv";
  if (cache[key]) return cache[key];

  const resolved = path.join(DATA_DIR, "aspects.csv");
  const result = {
    loaded: false,
    rows: [],
    nameToRow: {},
    aliasToRows: {},
    getSearchNames() {
      const names = new Set();
      for (const k of Object.keys(this.nameToRow)) names.add(k);
      for (const k of Object.keys(this.aliasToRows)) names.add(k);
      return Array.from(names);
    },
  };

  if (!fs.existsSync(resolved)) {
    cache[key] = result;
    return result;
  }

  const text = fs.readFileSync(resolved, "utf-8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    cache[key] = result;
    return result;
  }

  const header = parseCsvLine(lines[0]);
  const spiritIdx = header.indexOf("spirit");
  const nameIdx = header.indexOf("aspect_name");
  const urlsIdx = header.indexOf("image_urls");
  const twIdx = header.indexOf("name_zh_tw");
  const cnIdx = header.indexOf("name_zh_cn");

  if (nameIdx === -1) {
    cache[key] = result;
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const spirit = spiritIdx >= 0 ? (fields[spiritIdx] || "").trim() : "";
    const aspectName = (fields[nameIdx] || "").trim();
    const imageUrlsStr = urlsIdx >= 0 ? (fields[urlsIdx] || "").trim() : "";
    const nameZhTw = twIdx >= 0 ? (fields[twIdx] || "").trim() : "";
    const nameZhCn = cnIdx >= 0 ? (fields[cnIdx] || "").trim() : "";

    if (!aspectName) continue;

    const urls = parseImageUrls(imageUrlsStr);
    const row = {
      spirit,
      name: aspectName,
      image_urls: imageUrlsStr,
      urls,
      name_zh_tw: nameZhTw,
      name_zh_cn: nameZhCn,
    };
    result.rows.push(row);

    const spiritAspect = spirit ? normalizeSearch(spirit + " " + aspectName) : null;
    const nAspect = normalizeSearch(aspectName);
    const nTw = nameZhTw ? normalizeSearch(nameZhTw) : null;
    const nCn = nameZhCn ? normalizeSearch(nameZhCn) : null;

    if (spiritAspect) result.nameToRow[spiritAspect] = row;
    if (!result.aliasToRows[nAspect]) result.aliasToRows[nAspect] = [];
    result.aliasToRows[nAspect].push(row);
    if (nTw) result.nameToRow[nTw] = row;
    if (nCn) result.nameToRow[nCn] = row;
  }

  result.loaded = result.rows.length > 0;
  cache[key] = result;
  return result;
}

/**
 * Power progression CSV: key, name, url, name_zh_tw, name_zh_cn.
 * One image URL per spirit (power progression card). Search by spirit name or Chinese.
 */
function loadPowerProgressionCsv() {
  const key = "power_progression.csv";
  if (cache[key]) return cache[key];

  const resolved = path.join(DATA_DIR, "power_progression.csv");
  const result = {
    loaded: false,
    rows: [],
    nameToRow: {},
    getSearchNames() {
      return Array.from(Object.keys(this.nameToRow));
    },
  };

  if (!fs.existsSync(resolved)) {
    cache[key] = result;
    return result;
  }

  const text = fs.readFileSync(resolved, "utf-8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    cache[key] = result;
    return result;
  }

  const header = parseCsvLine(lines[0]);
  const keyIdx = header.indexOf("key");
  const nameIdx = header.indexOf("name");
  const urlIdx = header.indexOf("url");
  const twIdx = header.indexOf("name_zh_tw");
  const cnIdx = header.indexOf("name_zh_cn");

  if (nameIdx === -1 || urlIdx === -1) {
    cache[key] = result;
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const rowKey = keyIdx >= 0 ? (fields[keyIdx] || "").trim() : "";
    const name = (fields[nameIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    const nameZhTw = twIdx >= 0 ? (fields[twIdx] || "").trim() : "";
    const nameZhCn = cnIdx >= 0 ? (fields[cnIdx] || "").trim() : "";

    if (!name || !url) continue;

    const row = {
      key: rowKey,
      name,
      url,
      name_zh_tw: nameZhTw,
      name_zh_cn: nameZhCn,
    };
    result.rows.push(row);

    const nKey = rowKey ? normalizeSearch(rowKey) : null;
    const nName = normalizeSearch(name);
    const nTw = nameZhTw ? normalizeSearch(nameZhTw) : null;
    const nCn = nameZhCn ? normalizeSearch(nameZhCn) : null;

    if (nKey) result.nameToRow[nKey] = row;
    result.nameToRow[nName] = row;
    if (nTw) result.nameToRow[nTw] = row;
    if (nCn) result.nameToRow[nCn] = row;
  }

  result.loaded = result.rows.length > 0;
  cache[key] = result;
  return result;
}

/**
 * Extra panel CSV: key, name, url, name_zh_tw, name_zh_cn.
 * One image URL per spirit (extra panel). Search by spirit name or Chinese.
 */
function loadExtraCsv() {
  const key = "extra.csv";
  if (cache[key]) return cache[key];

  const resolved = path.join(DATA_DIR, "extra.csv");
  const result = {
    loaded: false,
    rows: [],
    nameToRow: {},
    getSearchNames() {
      return Array.from(Object.keys(this.nameToRow));
    },
  };

  if (!fs.existsSync(resolved)) {
    cache[key] = result;
    return result;
  }

  const text = fs.readFileSync(resolved, "utf-8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    cache[key] = result;
    return result;
  }

  const header = parseCsvLine(lines[0]);
  const keyIdx = header.indexOf("key");
  const nameIdx = header.indexOf("name");
  const urlIdx = header.indexOf("url");
  const twIdx = header.indexOf("name_zh_tw");
  const cnIdx = header.indexOf("name_zh_cn");

  if (nameIdx === -1 || urlIdx === -1) {
    cache[key] = result;
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const rowKey = keyIdx >= 0 ? (fields[keyIdx] || "").trim() : "";
    const name = (fields[nameIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    const nameZhTw = twIdx >= 0 ? (fields[twIdx] || "").trim() : "";
    const nameZhCn = cnIdx >= 0 ? (fields[cnIdx] || "").trim() : "";

    if (!name || !url) continue;

    const row = {
      key: rowKey,
      name,
      url,
      name_zh_tw: nameZhTw,
      name_zh_cn: nameZhCn,
    };
    result.rows.push(row);

    const nKey = rowKey ? normalizeSearch(rowKey) : null;
    const nName = normalizeSearch(name);
    const nTw = nameZhTw ? normalizeSearch(nameZhTw) : null;
    const nCn = nameZhCn ? normalizeSearch(nameZhCn) : null;

    if (nKey) result.nameToRow[nKey] = row;
    result.nameToRow[nName] = row;
    if (nTw) result.nameToRow[nTw] = row;
    if (nCn) result.nameToRow[nCn] = row;
  }

  result.loaded = result.rows.length > 0;
  cache[key] = result;
  return result;
}

/**
 * Reminder CSV: key, name, image_urls, name_zh_tw, name_zh_cn.
 * image_urls semicolon-separated (front;back for two-sided). Search by name or Chinese.
 */
function loadReminderCsv() {
  const key = "reminder.csv";
  if (cache[key]) return cache[key];

  const resolved = path.join(DATA_DIR, "reminder.csv");
  const result = {
    loaded: false,
    rows: [],
    nameToRow: {},
    getSearchNames() {
      return Array.from(Object.keys(this.nameToRow));
    },
  };

  if (!fs.existsSync(resolved)) {
    cache[key] = result;
    return result;
  }

  const text = fs.readFileSync(resolved, "utf-8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    cache[key] = result;
    return result;
  }

  const header = parseCsvLine(lines[0]);
  const keyIdx = header.indexOf("key");
  const nameIdx = header.indexOf("name");
  const urlsIdx = header.indexOf("image_urls");
  const urlIdx = header.indexOf("url");
  const twIdx = header.indexOf("name_zh_tw");
  const cnIdx = header.indexOf("name_zh_cn");

  const hasUrls = urlsIdx >= 0 || urlIdx >= 0;
  if (nameIdx === -1 || !hasUrls) {
    cache[key] = result;
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const rowKey = keyIdx >= 0 ? (fields[keyIdx] || "").trim() : "";
    const name = (fields[nameIdx] || "").trim();
    const imageUrlsStr = urlsIdx >= 0 ? (fields[urlsIdx] || "").trim() : (urlIdx >= 0 ? (fields[urlIdx] || "").trim() : "");
    const nameZhTw = twIdx >= 0 ? (fields[twIdx] || "").trim() : "";
    const nameZhCn = cnIdx >= 0 ? (fields[cnIdx] || "").trim() : "";

    if (!name) continue;
    const urls = parseImageUrls(imageUrlsStr);
    if (urls.length === 0) continue;

    const row = {
      key: rowKey,
      name,
      image_urls: imageUrlsStr,
      urls,
      url: urls[0],
      name_zh_tw: nameZhTw,
      name_zh_cn: nameZhCn,
    };
    result.rows.push(row);

    const nKey = rowKey ? normalizeSearch(rowKey) : null;
    const nName = normalizeSearch(name);
    const nTw = nameZhTw ? normalizeSearch(nameZhTw) : null;
    const nCn = nameZhCn ? normalizeSearch(nameZhCn) : null;

    if (nKey) result.nameToRow[nKey] = row;
    result.nameToRow[nName] = row;
    if (nTw) result.nameToRow[nTw] = row;
    if (nCn) result.nameToRow[nCn] = row;
  }

  result.loaded = result.rows.length > 0;
  cache[key] = result;
  return result;
}

module.exports = {
  normalizeSearch,
  parseImageUrls,
  loadSpiritsCsv: () => loadKeyNameCsv("spirits.csv"),
  loadAdversariesCsv: () => loadKeyNameCsv("adversaries.csv"),
  loadScenariosCsv: () => loadKeyNameCsv("scenarios.csv"),
  loadIncarnaCsv: () => loadKeyNameCsv("incarna.csv"),
  loadPlayerAidsCsv: () => loadKeyNameCsv("player_aids.csv"),
  loadAspectsCsv,
  loadPowerProgressionCsv,
  loadExtraCsv,
  loadReminderCsv,
};
