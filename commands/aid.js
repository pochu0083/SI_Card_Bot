/**
 * -aid [base|je|ni] — Returns player aid card image(s) for the given keyword.
 * Keywords: base (Base game, 4 cards), je (Jagged Earth, 2 cards), ni (Nature Incarnate, 2 cards).
 */

const namesCsv = require("./loadNamesCsv.js");

const KEYWORDS = ["base", "je", "ni"];

module.exports = {
  name: "aid",
  description: "Gets player aid card images by keyword: base, je, ni",
  public: true,
  async execute(msg, args) {
    if (args.length === 0) {
      return msg.channel.send(
        "Player aid keywords: **base** (Base game), **je** (Jagged Earth), **ni** (Nature Incarnate).\nUsage: `-aid base` | `-aid je` | `-aid ni`"
      );
    }

    const input = args[0].trim().toLowerCase();
    const keyword = KEYWORDS.find((k) => k === input || k.startsWith(input));
    if (!keyword) {
      return msg.channel.send(
        "Unknown keyword. Use **base**, **je**, or **ni**. Example: `-aid base`"
      );
    }

    const csv = namesCsv.loadPlayerAidsCsv();
    if (!csv.loaded) {
      return msg.channel.send("Player aid data not loaded. Add data/player_aids.csv.");
    }

    const row = csv.nameToRow[keyword] || csv.rows.find((r) => r.key === keyword);
    if (!row || !row.urls || row.urls.length === 0) {
      return msg.channel.send("No player aid images found for that keyword.");
    }

    return msg.channel.send(row.urls.join("\n"));
  },
};
