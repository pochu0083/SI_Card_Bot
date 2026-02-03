const ad = require("./AdversaryNames.js");
const { getCardName } = require("./sendCardLink.js");
const namesCsv = require("./loadNamesCsv.js");

module.exports = {
  name: "adversary",
  description: "Get a single adversary panel",
  public: true,
  async execute(msg, args) {
    // No args: list adversaries (from CSV if loaded, else from AdversaryNames)
    if (args.length === 0) {
      const csv = namesCsv.loadAdversariesCsv();
      if (csv.loaded) {
        const list = csv.rows.map((r) => `* ${r.name} (${r.key})`).join("\n");
        return msg.channel.send("Choose an adversary:\n" + list);
      }
      let panel = "Choose an adversary: \n";
      for (const [, adversary] of ad.ad) {
        panel +=
          "* " +
          adversary.name +
          " (" +
          adversary.title +
          ", " +
          adversary.alias.join(" , ") +
          ")\n";
      }
      return msg.channel.send(panel);
    }

    const input = args.join(" ").trim();

    // Try CSV first (Chinese keywords + image URL from data/adversaries.csv)
    const csv = namesCsv.loadAdversariesCsv();
    if (csv.loaded) {
      const searchNames = csv.getSearchNames();
      const matched = getCardName(input, searchNames);
      if (matched) {
        const row = csv.nameToRow[matched];
        if (row && row.urls && row.urls.length > 0) {
          return msg.channel.send(row.urls[0]);
        }
      }
    }

    // Fall back to AdversaryNames.js
    const searchString = input.toLowerCase();
    for (const [, adversary] of ad.ad) {
      if (adversary.title.toLowerCase() === searchString) {
        return msg.channel.send(adversary.panel);
      }
      for (const alias of adversary.alias) {
        if (alias.toLowerCase().indexOf(searchString) >= 0) {
          return msg.channel.send(adversary.panel);
        }
      }
    }

    msg.channel.send("Adversary not found. Use -adversary with no args to list options.");
  },
};
