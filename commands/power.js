const s = require("./sendCardLink.js");

module.exports = {
  name: "power",
  description: "Power Search",
  public: true,

  async execute(msg, args) {
    await s.sendCardLinkFromCsv(msg, args, "power");
  },
};
