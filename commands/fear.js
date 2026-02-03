const s = require("./sendCardLink.js");

module.exports = {
  name: "fear",
  description: "Fear card search",
  public: true,

  async execute(msg, args) {
    await s.sendCardLinkFromCsv(msg, args, "fear");
  },
};
