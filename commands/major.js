const s = require("./sendCardLink.js");

module.exports = {
  name: "major",
  description: "Major card search",
  public: true,

  async execute(msg, args) {
    await s.sendCardLinkFromCsv(msg, args, "major");
  },
};
