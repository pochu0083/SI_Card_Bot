/**
 * Sends an image of the power progression for that spirit.
 * Resolves spirit by name (or Chinese) from data/power_progression.csv, then falls back to spiritNames.js.
 */
const spirit = require("./spirit.js");
const { getCardName } = require("./sendCardLink.js");
const namesCsv = require("./loadNamesCsv.js");

module.exports = {
  name: "progression",
  description: "Gets the power progression for a spirit",
  public: true,

  async execute(msg, args) {
    try {
      if (args.length < 1) {
        throw new Error("Please provide at least 3 letters to query with.");
      }

      const input = args.join(" ").trim();

      // Try CSV first (spirit name or Chinese from data/power_progression.csv)
      const csv = namesCsv.loadPowerProgressionCsv();
      if (csv.loaded) {
        const searchNames = csv.getSearchNames();
        const matched = getCardName(input, searchNames);
        if (matched) {
          const row = csv.nameToRow[matched];
          if (row && row.url) {
            return msg.channel.send(row.url);
          }
        }
      }

      // Fall back to spiritNames.js
      const possibleSpirits = spirit.searchForSpirit(input.toLowerCase());
      if (possibleSpirits.length === 1) {
        const spiritObj = possibleSpirits[0];
        if (spiritObj.powerProgression) {
          return msg.channel.send(spiritObj.powerProgression);
        }
        return msg.channel.send(
          `${spiritObj.name} (${spiritObj.emote}) does not have a power progression.`,
        );
      }
      throw new Error("Try again with a more specific string.");
    } catch (e) {
      console.log(e);
      return msg.channel.send(e.toString());
    }
  },
};
