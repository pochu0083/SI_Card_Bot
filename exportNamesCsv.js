/**
 * Export spirit, adversary, aspect, scenario, and incarna names to CSV
 * for adding Chinese translations (name_zh_tw, name_zh_cn).
 * Run from project root: node exportNamesCsv.js
 * Parses source files directly so no bot dependencies (Discord, etc.) are required.
 */

const fs = require("fs");
const path = require("path");

const COMMANDS = path.join(__dirname, "commands");

function escapeCsvField(s) {
  if (s == null) return "";
  const str = String(s).trim();
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function writeCsv(fileName, header, rows) {
  const outDir = path.join(__dirname, "data");
  const outPath = path.join(outDir, fileName);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const lines = [header, ...rows.map((r) => r.map(escapeCsvField).join(","))];
  fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
  console.log("Wrote", rows.length, "rows to", outPath);
}

// Extract all http(s) URLs from a string (e.g. from panel: ["url1","url2"] or panel: "url")
function extractUrls(text) {
  if (!text || typeof text !== "string") return [];
  return [...text.matchAll(/"https?:\/\/[^"]+"/g)].map((m) => m[0].slice(1, -1).trim());
}
function joinUrls(urls) {
  return (urls && urls.length) ? urls.filter(Boolean).join(";") : "";
}

// Parse spiritNames.js: each spirit block has name, title, panel: [urls]
function exportSpirits() {
  const src = fs.readFileSync(path.join(COMMANDS, "spiritNames.js"), "utf-8");
  const names = [...src.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
  const titles = [...src.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1]);
  const panelBlocks = [...src.matchAll(/panel:\s*\[([\s\S]*?)\]\s*,/g)]
    .map((m) => m[1])
    .filter((block) => /https?:\/\//.test(block));
  const urlsList = panelBlocks.map((block) => joinUrls(extractUrls(block)));
  const rows = titles.map((key, i) => [
    key,
    names[i] || "",
    urlsList[i] || "",
    "",
    "",
  ]);
  writeCsv("spirits.csv", "key,name,image_urls,name_zh_tw,name_zh_cn", rows);
}

// Parse AdversaryNames.js: title, name, panel: "url" per adversary block
function exportAdversaries() {
  const src = fs.readFileSync(path.join(COMMANDS, "AdversaryNames.js"), "utf-8");
  const rows = [];
  const blockRe = /var\s+\w+\s*=\s*\{\s*title:\s*"([^"]+)"[^}]*?name:\s*"([^"]+)"[^}]*?panel:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    rows.push([m[1], m[2], m[3] || "", "", ""]);
  }
  writeCsv("adversaries.csv", "key,name,image_urls,name_zh_tw,name_zh_cn", rows);
}

// Parse aspectNames.js: each aspect var has objects with name (and optional spirit)
const ASPECT_SPIRITS = [
  "Lightning", "River", "Shadows", "Earth", "Ocean", "Fangs", "Bringer",
  "Memory", "Lure", "Serpent", "Green", "Keeper", "Mists", "Thunderspeaker", "Wildfire",
];
const ASPECT_VARS = [
  "lightning", "rivers", "shadows", "earth", "ocean", "fangs", "bringer",
  "memory", "lure", "serpent", "green", "keeper", "mists", "thunderspeaker", "wildfire",
];

function exportAspects() {
  const src = fs.readFileSync(path.join(COMMANDS, "aspectNames.js"), "utf-8");
  const rows = [];
  for (let i = 0; i < ASPECT_VARS.length; i++) {
    const varRe = new RegExp("var\\s+" + ASPECT_VARS[i] + "\\s*=\\s*\\[([\\s\\S]*?)\\];");
    const vm = src.match(varRe);
    if (vm) {
      const spirit = ASPECT_SPIRITS[i] || "";
      const arrayContent = vm[1];
      // Each aspect object: { name: "...", ... panel: [...] }; get name and panel URLs in order
      const objRe = /\{\s*name:\s*"([^"]+)"[\s\S]*?panel:\s*\[([\s\S]*?)\]/g;
      let om;
      while ((om = objRe.exec(arrayContent)) !== null) {
        const urls = joinUrls(extractUrls(om[2]));
        rows.push([spirit, om[1], urls, "", ""]);
      }
    }
  }
  writeCsv("aspects.csv", "spirit,aspect_name,image_urls,name_zh_tw,name_zh_cn", rows);
}

// scenarioNames.js: each var has name, link, linkBack (two image URLs)
function exportScenarios() {
  const src = fs.readFileSync(path.join(COMMANDS, "scenarioNames.js"), "utf-8");
  const keys = [
    "blitz", "GtIH", "RoT", "DI", "SW", "PLF", "WtS", "RotDF", "EI", "DT",
    "TGR", "ADoS", "VT", "DU", "SoC", "LSoC",
  ];
  const rows = [];
  const varRe = /var\s+(\w+)\s*=\s*\{\s*name:\s*"([^"]+)"[\s\S]*?link:\s*"([^"]+)"[\s\S]*?linkBack:\s*"([^"]+)"/g;
  let m;
  let i = 0;
  while ((m = varRe.exec(src)) !== null) {
    if (m[1] !== "scenario") {
      const urls = [m[3], m[4]].filter(Boolean).join(";");
      rows.push([keys[i] ?? m[1], m[2], urls, "", ""]);
      i++;
    }
  }
  writeCsv("scenarios.csv", "key,name,image_urls,name_zh_tw,name_zh_cn", rows);
}

// incarnaNames.js: var x = { name: "...", front: "url", back: "url" } (front/back can be multiline)
function exportIncarna() {
  const src = fs.readFileSync(path.join(COMMANDS, "incarnaNames.js"), "utf-8");
  const keys = ["voice", "towering", "breath", "ember", "locus", "warrior", "lair"];
  const rows = [];
  const varRe = /var\s+(\w+)\s*=\s*\{\s*name:\s*"([^"]+)"[\s\S]*?front:[\s\n]*"([^"]+)"[\s\S]*?back:\s*"([^"]+)"/g;
  let m;
  let i = 0;
  while ((m = varRe.exec(src)) !== null) {
    if (m[1] !== "incarna" && !m[2].startsWith("http")) {
      const urls = [m[3], m[4]].filter((u) => u && u.startsWith("http")).join(";");
      rows.push([keys[i] ?? m[1], m[2], urls, "", ""]);
      i++;
    }
  }
  writeCsv("incarna.csv", "key,name,image_urls,name_zh_tw,name_zh_cn", rows);
}

function main() {
  exportSpirits();
  exportAdversaries();
  exportAspects();
  exportScenarios();
  exportIncarna();
  console.log("Done. Fill name_zh_tw and name_zh_cn in data/*.csv as needed.");
}

main();
