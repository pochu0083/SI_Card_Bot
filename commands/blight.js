const s = require("./sendCardLink.js");

module.exports = {
  name: "blight",
  description: "Blight card search",
  public: true,

  async execute(msg, args) {
    await s.sendCardLinkFromCsv(msg, args, "blight");
  },
};
