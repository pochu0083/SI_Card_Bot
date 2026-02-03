const s = require("./sendCardLink.js");

module.exports = {
  name: "unique",
  description: "Unique card search",
  public: true,

  async execute(msg, args) {
    await s.sendCardLinkFromCsv(msg, args, "unique");
  },
};
