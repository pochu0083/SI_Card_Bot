const s = require("./sendCardLink.js");

module.exports = {
  name: "event",
  description: "Event Search",
  public: true,
  async execute(msg, args) {
    await s.sendCardLinkFromCsv(msg, args, "event");
  },
};
