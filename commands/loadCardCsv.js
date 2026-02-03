/**
 * Load card data from CSV (name, url, type, aliases, name_zh_tw, name_zh_cn).
 * Builds nameToRow and aliasToRows for sendCardLinkFromCsv.
 * Chinese columns: name_zh_tw (Traditional), name_zh_cn (Simplified) — used for search; normalized like cleanInput (spaces → _).
 * CSV path: CARDS_CSV env or ./data/cards.csv relative to project root.
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_CSV_PATH = path.join(__dirname, "..", "data", "cards.csv");

let cached = null;

/** Normalize search string to match cleanInput output (trim, spaces → _) so Chinese/English both match. */
function normalizeSearch(s) {
  if (s == null || typeof s !== "string") return "";
  return s.trim().replace(/\s+/g, "_");
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

function loadCardCsv() {
  if (cached) return cached;

  const csvPath = process.env.CARDS_CSV || DEFAULT_CSV_PATH;
  const resolved = path.isAbsolute(csvPath) ? csvPath : path.resolve(process.cwd(), csvPath);

  if (!fs.existsSync(resolved)) {
    cached = { rows: [], nameToRow: {}, aliasToRows: {}, loaded: false };
    return cached;
  }

  const text = fs.readFileSync(resolved, "utf-8");
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    cached = { rows: [], nameToRow: {}, aliasToRows: {}, loaded: false };
    return cached;
  }

  const header = parseCsvLine(lines[0]);
  const nameIdx = header.indexOf("name");
  const urlIdx = header.indexOf("url");
  const typeIdx = header.indexOf("type");
  const aliasesIdx = header.indexOf("aliases");
  const nameZhTwIdx = header.indexOf("name_zh_tw");
  const nameZhCnIdx = header.indexOf("name_zh_cn");
  const aliasesZhTwIdx = header.indexOf("aliases_zh_tw");
  const aliasesZhCnIdx = header.indexOf("aliases_zh_cn");

  if (nameIdx === -1 || urlIdx === -1) {
    cached = { rows: [], nameToRow: {}, aliasToRows: {}, loaded: false };
    return cached;
  }

  const rows = [];
  const nameToRow = {};
  const aliasToRows = {};

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if (fields.length <= Math.max(nameIdx, urlIdx)) continue;

    const name = (fields[nameIdx] || "").trim();
    const url = (fields[urlIdx] || "").trim();
    const type = typeIdx >= 0 ? (fields[typeIdx] || "").trim() : "";
    const aliasesStr = aliasesIdx >= 0 ? (fields[aliasesIdx] || "").trim() : "";
    const aliases = aliasesStr ? aliasesStr.split(";").map((a) => a.trim()).filter(Boolean) : [];
    const nameZhTw = nameZhTwIdx >= 0 ? (fields[nameZhTwIdx] || "").trim() : "";
    const nameZhCn = nameZhCnIdx >= 0 ? (fields[nameZhCnIdx] || "").trim() : "";
    const aliasesZhTwStr = aliasesZhTwIdx >= 0 ? (fields[aliasesZhTwIdx] || "").trim() : "";
    const aliasesZhCnStr = aliasesZhCnIdx >= 0 ? (fields[aliasesZhCnIdx] || "").trim() : "";
    const aliasesZhTw = aliasesZhTwStr ? aliasesZhTwStr.split(";").map((a) => a.trim()).filter(Boolean) : [];
    const aliasesZhCn = aliasesZhCnStr ? aliasesZhCnStr.split(";").map((a) => a.trim()).filter(Boolean) : [];

    if (!name || !url) continue;

    const row = {
      name,
      url,
      type,
      aliases,
      name_zh_tw: nameZhTw,
      name_zh_cn: nameZhCn,
      aliases_zh_tw: aliasesZhTw,
      aliases_zh_cn: aliasesZhCn,
    };
    rows.push(row);
    nameToRow[name] = row;

    const nTw = normalizeSearch(nameZhTw);
    if (nTw) nameToRow[nTw] = row;
    const nCn = normalizeSearch(nameZhCn);
    if (nCn) nameToRow[nCn] = row;

    for (const alias of aliases) {
      if (!aliasToRows[alias]) aliasToRows[alias] = [];
      aliasToRows[alias].push(row);
    }
    for (const a of aliasesZhTw) {
      const n = normalizeSearch(a);
      if (n) {
        if (!aliasToRows[n]) aliasToRows[n] = [];
        aliasToRows[n].push(row);
      }
    }
    for (const a of aliasesZhCn) {
      const n = normalizeSearch(a);
      if (n) {
        if (!aliasToRows[n]) aliasToRows[n] = [];
        aliasToRows[n].push(row);
      }
    }
  }

  cached = { rows, nameToRow, aliasToRows, loaded: true };
  return cached;
}

function getRowsByType(type) {
  const { rows } = loadCardCsv();
  if (!type) return rows;
  if (type === "power") {
    return rows.filter((r) => r.type === "unique" || r.type === "minor" || r.type === "major");
  }
  return rows.filter((r) => r.type === type);
}

function getAllSearchNames(typeFilter) {
  const rows = getRowsByType(typeFilter);
  const names = new Set(rows.map((r) => r.name));
  for (const r of rows) {
    for (const a of r.aliases) names.add(a);
    const nTw = normalizeSearch(r.name_zh_tw);
    if (nTw) names.add(nTw);
    const nCn = normalizeSearch(r.name_zh_cn);
    if (nCn) names.add(nCn);
    if (r.aliases_zh_tw) {
      for (const a of r.aliases_zh_tw) {
        const n = normalizeSearch(a);
        if (n) names.add(n);
      }
    }
    if (r.aliases_zh_cn) {
      for (const a of r.aliases_zh_cn) {
        const n = normalizeSearch(a);
        if (n) names.add(n);
      }
    }
  }
  return Array.from(names);
}

function isLoaded() {
  return loadCardCsv().loaded;
}

module.exports = {
  loadCardCsv,
  getRowsByType,
  getAllSearchNames,
  isLoaded,
};
