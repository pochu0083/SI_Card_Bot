const inc = require("./incarnaNames.js");
const { getCardName } = require("./sendCardLink.js");
const namesCsv = require("./loadNamesCsv.js");

module.exports = {
  name: "incarna",
  description: "Get an incarna",
  public: true,
  async execute(msg, args) {
    if (args.length === 0) {
      return msg.channel.send("Please name a spirit with an incarna (e.g. Voice, Towering, Breath).");
    }

    let side = "front";
    if (args.length > 1 && (args[args.length - 1] === "front" || args[args.length - 1] === "back")) {
      side = args.pop();
    }
    const input = args.join(" ").trim();

    // Try CSV first (Chinese keywords + image URLs from data/incarna.csv)
    const csv = namesCsv.loadIncarnaCsv();
    if (csv.loaded) {
      const searchNames = csv.getSearchNames();
      const matched = getCardName(input, searchNames);
      if (matched) {
        const row = csv.nameToRow[matched];
        if (row && row.urls && row.urls.length > 0) {
          const idx = side === "back" && row.urls.length > 1 ? 1 : 0;
          return msg.channel.send(row.urls[idx]);
        }
      }
    }

    // Fall back to incarnaNames.js
    const searchString = input.toLowerCase();
    for (const incarna of inc.incarna) {
      if (incarna.name.toLowerCase().indexOf(searchString) >= 0) {
        const panel = side === "front" ? incarna.front : incarna.back;
        return msg.channel.send(panel);
      }
      for (const alias of incarna.alias) {
        if (alias.toLowerCase().indexOf(searchString) >= 0) {
          const panel = side === "front" ? incarna.front : incarna.back;
          return msg.channel.send(panel);
        }
      }
    }

    msg.channel.send("Incarna not found. Try Voice, Towering, Breath, Ember, Locus, Warrior, or Lair.");
  },
};
