const getCardName = require("./sendCardLink.js").getCardName;
const scenario = require("./scenarioNames.js").scenario;
const namesCsv = require("./loadNamesCsv.js");

module.exports = {
  name: "scenario",
  description: "Gets the front or back panel for a given scenario",
  public: true,
  async execute(msg, args) {
    if (args.length === 0) {
      const csv = namesCsv.loadScenariosCsv();
      const names = csv.loaded
        ? csv.rows.map((r) => r.name)
        : scenario.map((s) => s.name);
      return msg.channel.send("Scenarios are:\n" + names.join(", "));
    }

    let side = "back";
    if (args[0] === "back" || args[0] === "front") {
      side = args.shift();
    }
    const input = args.join(" ").trim();
    if (!input) {
      return msg.channel.send("Scenarios are:\n" + scenario.map((s) => s.name).join(", "));
    }

    // Try CSV first (Chinese keywords + image URLs from data/scenarios.csv)
    const csv = namesCsv.loadScenariosCsv();
    if (csv.loaded) {
      const searchNames = csv.getSearchNames();
      const matched = getCardName(input, searchNames);
      if (matched) {
        const row = csv.nameToRow[matched];
        if (row && row.urls && row.urls.length > 0) {
          const idx = side === "front" ? 0 : Math.min(1, row.urls.length - 1);
          return msg.channel.send(row.urls[idx]);
        }
      }
    }

    // Fall back to scenarioNames.js
    const names = scenario.map((s) => s.name);
    const panel = getCardName(input, names);
    for (const s of scenario) {
      if (s.name === panel) {
        const url = side === "front" ? s.link : s.linkBack;
        return msg.channel.send(url);
      }
    }
    msg.channel.send("Scenario not found. Use -scenario with no args to list options.");
  },
};
