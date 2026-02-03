const s = require("./sendCardLink.js");

module.exports = {
  name: "minor",
  description: "Minor card search",
  public: true,

  async execute(msg, args) {
    await s.sendCardLinkFromCsv(msg, args, "minor");
  },
};
