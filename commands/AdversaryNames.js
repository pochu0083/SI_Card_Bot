/**
 * Definition of all adversaries
 */

const Discord = require("discord.js");
const { InvaderDeckCard } = require("./deckCalc.js");

var habsburgmining = {
  title: "habsburg_mining",
  name: "Habsburg Mining Expedition",
  emote: "<:FlagHabsburgMining:1181395803479212103>",
  difficulty: [2, 3, 5, 6, 8, 9, 10],
  panel: "https://i.imgur.com/xzXF6vu.png",
  alias: [
    "<:FlagHabsburgMining:1181395803479212103>",
    ":pick:",
    "hme",
    "saltburg",
    "mining-expedition",
    "mining",
  ],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    3: (d) => {
      return d;
    },
    4: (d) => {
      const indices = d.reduce((acc, card, index) => {
        if (card.stage === 2 && card.stage == card.cardSymbol) {
          acc.push(index);
        }
        return acc;
      }, []);
      d[indices[1]] = new InvaderDeckCard(2, "S");
      return d;
    },
    5: (d) => {
      return d;
    },
    6: (d) => {
      return d;
    },
  },
};

var prussia = {
  title: "prussia",
  name: "The Kingdom of Brandenburg-Prussia",
  emote: "<:FlagBrandenburgPrussia:852366012846309406>",
  difficulty: [1, 2, 4, 6, 7, 9, 10],
  panel: "https://imgur.com/KdyfP3C",
  alias: ["<:FlagBrandenburgPrussia:852366012846309406>", "bp"],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    // put one of the stage 3 cards between stage 1 and 2
    2: (d) => {
      const index = d.findIndex((card) => card.stage === 2);
      d.splice(index, 0, d.pop());
      if (d[d.length - 1].stage !== 3) {
        throw new Error("Bad 3 wasn't found");
      }
      return d;
    },
    // remove an additional stage I card
    3: (d) => {
      const index = d.findIndex((card) => card.stage === 1);
      if (index != -1) {
        d.splice(index, 1);
      }
      return d;
    },
    // remove an additional stage II card
    4: (d) => {
      const index = d.findIndex((card) => card.stage === 2);
      if (index != -1) {
        d.splice(index, 1);
      }
      return d;
    },
    // remove an additional stage I card
    5: (d) => {
      const index = d.findIndex((card) => card.stage === 1);
      if (index != -1) {
        d.splice(index, 1);
      }
      return d;
    },
    // remove all stage I cards
    6: (d) => {
      let newarr = d.filter((a) => a.stage !== 1);
      return newarr;
    },
  },
};

var england = {
  title: "england",
  name: "The Kingdom of England",
  emote: "<:FlagEngland:852366012175482900>",
  difficulty: [1, 3, 4, 6, 7, 9, 10],
  panel: "https://imgur.com/c5KzcIq",
  alias: ["<:FlagEngland:852366012175482900>", "🏴󠁧󠁢󠁥󠁮󠁧󠁿"],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    3: (d) => {
      return d;
    },
    4: (d) => {
      return d;
    },
    5: (d) => {
      return d;
    },
    6: (d) => {
      return d;
    },
  },
};

var france = {
  title: "france",
  name: "The Kingdom of France",
  emote: "<:FlagFrance:852366013243981885>",
  difficulty: [2, 3, 5, 7, 8, 9, 10],
  panel: "https://imgur.com/S8lL3cA",
  alias: ["<:FlagFrance:852366013243981885>", "🇫🇷"],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    3: (d) => {
      return d;
    },
    4: (d) => {
      return d;
    },
    5: (d) => {
      return d;
    },
    6: (d) => {
      return d;
    },
  },
};

var habsburg = {
  title: "habsburg_livestock",
  name: "The Habsburg Monarchy",
  emote: "<:FlagHabsburg:852366013638639636>",
  difficulty: [2, 3, 5, 6, 8, 9, 10],
  panel: "https://imgur.com/GtptfDJ",
  alias: [
    "<:FlagHabsburg:852366013638639636>",
    "🐮",
    "monarchy",
    "hlc",
    "cowburg",
    "livestock-colony",
    "livestock",
    "habsburger",
  ],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    3: (d) => {
      const index = d.findIndex((card) => card.stage === 1);
      if (index != -1) {
        d.splice(index, 1);
      }
      return d;
    },
    4: (d) => {
      return d;
    },
    // adds the reminder card to the deck as a 0 as it should never be removed by any
    // other adversary
    5: (d) => {
      d.splice(5, 0, new InvaderDeckCard(0, "Wave of Immigration Reminder"));
      return d;
    },
    6: (d) => {
      return d;
    },
  },
};

var russia = {
  title: "russia",
  name: "The Tsardom of Russia",
  emote: "<:FlagRussia:852366012639739945>",
  difficulty: [1, 3, 4, 6, 7, 9, 11],
  panel: "https://imgur.com/n16FmcP",
  alias: ["<:FlagRussia:852366012639739945>", "🇷🇺"],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    3: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    4: (d) => {
      const indices = d.reduce((acc, card, index) => {
        if (card.stage === 2 && card.stage == card.cardSymbol) {
          acc.push(index);
        }
        return acc;
      }, []);
      indices.reverse().forEach((index) => {
        d.splice(index + 1, 0, d.pop());
        if (d[d.length - 1].stage !== 3) {
          throw new Error("Bad 3 wasn't found");
        }
      });
      return d;
    },
    5: (d) => {
      return d;
    },
    6: (d) => {
      return d;
    },
  },
};

var scotland = {
  title: "scotland",
  name: "The Kingdom of Scotland",
  emote: "<:FlagScotland:852366013621207040>",
  difficulty: [1, 3, 4, 6, 7, 8, 10],
  panel: "https://imgur.com/A5HccZx",
  alias: ["<:FlagScotland:852366013621207040>", "🏴󠁧󠁢󠁳󠁣󠁴󠁿"],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    2: (d) => {
      const indices = d.reduce((acc, card, index) => {
        if (card.stage === 2 && card.cardSymbol == card.stage) {
          acc.push(index);
        }
        return acc;
      }, []);
      // replace the 3rd stage II card that ISN'T an adversary specific
      // card with Coastal card
      d[indices[2]] = new InvaderDeckCard(2, "C");
      // then, move the two Stage II cards above it up by one
      d.splice(indices[0] - 1, 0, d.splice(indices[0], 1)[0]);
      d.splice(indices[1] - 1, 0, d.splice(indices[1], 1)[0]);
      return d;
    },
    3: (d) => {
      return d;
    },
    4: (d) => {
      // replaces the last stage 1 card with the bottom stage 3 card
      const index = d.findLastIndex((card) => card.stage === 1);
      if (index !== -1) {
        const stage3index = d.findLastIndex((card) => card.stage === 3);
        if (stage3index > -1) {
          // replaces the last stage 1 card with the last stage 3 card
          d[index] = d.splice(stage3index, 1).shift();
        }
      }
      return d;
    },
    5: (d) => {
      return d;
    },
    6: (d) => {
      return d;
    },
  },
};

var sweden = {
  title: "sweden",
  name: "The Kingdom of Sweden",
  emote: "<:FlagSweden:852366014434770963>",
  difficulty: [1, 2, 3, 5, 6, 7, 8],
  panel: "https://imgur.com/D6ZeLOV",
  alias: ["<:FlagSweden:852366014434770963>", "🇸🇪"],
  deckModification: {
    0: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    3: (d) => {
      return d;
    },
    4: (d) => {
      return d;
    },
    5: (d) => {
      return d;
    },
    6: (d) => {
      return d;
    },
  },
};

let ad = new Discord.Collection();

ad.set("prussia", prussia);
ad.set("england", england);
ad.set("france", france);
ad.set("habsburg", habsburg);
ad.set("russia", russia);
ad.set("scotland", scotland);
ad.set("sweden", sweden);
ad.set("habsburgmining", habsburgmining);

exports.ad = ad;
