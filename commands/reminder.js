/**
 * Sends a reminder image by name.
 * Resolves by name (or Chinese) from data/reminder.csv.
 */
const { getCardName } = require("./sendCardLink.js");
const namesCsv = require("./loadNamesCsv.js");

module.exports = {
  name: "reminder",
  description: "Gets a reminder image by name",
  public: true,

  async execute(msg, args) {
    try {
      if (args.length < 1) {
        throw new Error("Please provide at least 3 letters to query with.");
      }

      const input = args.join(" ").trim();
      const csv = namesCsv.loadReminderCsv();

      if (!csv.loaded) {
        return msg.channel.send("No reminder data. Add data/reminder.csv with key, name, url.");
      }

      const searchNames = csv.getSearchNames();
      const matched = getCardName(input, searchNames);
      if (matched) {
        const row = csv.nameToRow[matched];
        if (row && row.url) {
          return msg.channel.send(row.url);
        }
      }

      return msg.channel.send("No reminder found for that name. Try -search or check spelling.");
    } catch (e) {
      console.log(e);
      return msg.channel.send(e.toString());
    }
  },
};
