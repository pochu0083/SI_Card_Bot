const spirits = require("./spiritNames.js").spirits;
const levenshtein = require("js-levenshtein");
const { getCardName } = require("./sendCardLink.js");
const namesCsv = require("./loadNamesCsv.js");

module.exports = {
  name: "spirit",
  description: "Spirit Search",
  public: true,
  async execute(msg, args) {
    try {
      if (args.length < 1) {
        throw new Error("Please provide at least 3 letters to query with.");
      }

      const mods = {
        front: false,
        back: false,
        unique: false,
      };

      for (const arg of Object.keys(mods)) {
        const idx = args.indexOf(arg);
        if (idx >= 0) {
          mods[arg] = true;
          args.splice(idx, 1);
        }
      }

      const input = args.join(" ").trim();
      if (!input) {
        throw new Error("Please provide at least 3 letters to query with.");
      }

      // Try CSV first (Chinese keywords + image URLs from data/spirits.csv)
      const csv = namesCsv.loadSpiritsCsv();
      if (csv.loaded) {
        const searchNames = csv.getSearchNames();
        const matched = getCardName(input, searchNames);
        if (matched) {
          const row = csv.nameToRow[matched];
          if (row && row.urls && row.urls.length > 0) {
            const idx = mods.back && row.urls.length > 1 ? 1 : 0;
            return await msg.channel.send(row.urls[idx]);
          }
        }
      }

      // Fall back to spiritNames.js
      const possibleSpirits = searchForSpirit(input.toLowerCase());
      if (possibleSpirits.length === 1) {
        return await sendSpirit(mods, msg, possibleSpirits[0]);
      }
      throw new Error("Try again with a more specific string.");
    } catch (e) {
      console.log(e);
      return msg.channel.send(e.toString());
    }
  },
  searchForSpirit,
};

/**
 * Returns a spirit object when given a string
 * @param {*} spiritName
 */
function searchForSpirit(searchStringParam) {
  if (searchStringParam.length < 3) {
    throw new Error("Please provide at least 3 letters to query with.");
  }
  const searchString = searchStringParam.toLowerCase();

  let foundSpirits = [];

  // Start with simple substring search
  for (let i = 0; i < spirits.length; i++) {
    const spirit = spirits[i];
    if (spirit.name.toLowerCase().indexOf(searchString) >= 0) {
      foundSpirits.push(spirit);
    } else {
      for (const alias of spirit.aliases) {
        if (alias.indexOf(searchString) >= 0) {
          foundSpirits.push(spirit);
        }
      }
    }
  }

  let smallestDistance = Infinity;
  // If not found, find by levenshtein distance on all available substrings
  if (foundSpirits.length === 0) {
    for (const spirit of spirits) {
      const spiritName = spirit.name.toLowerCase();
      for (let i = 0; i <= spiritName.length - searchString.length; i++) {
        const subString = spiritName.substring(i, i + searchString.length);
        const distance = levenshtein(subString, searchString);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          foundSpirits = [spirit];
        }
      }
    }
  }

  console.log(foundSpirits);

  // if levenshtein returns a single spirit, return that
  if (foundSpirits.length === 1) {
    return foundSpirits;
  } else if (foundSpirits.length > 1) {
    // try to filter the ones found to spirits which have that EXACT word (ignoring apostrophised plurals for Stone's), not just a substring match
    const uniqueSpirits = foundSpirits.filter(
      (foundSpirit) =>
        sanitiseSpiritName(foundSpirit.name).indexOf(searchString) > -1,
    );
    return uniqueSpirits;
  } else {
    throw new Error(
      "Search string resulted in zero matches. Please try another search term (for example, Serpent or River).",
    );
  }
}

/**
 * returns a list of tokenised words, removing any apostrophised plurals and forcing lowercase
 * @param {} spiritName
 */
function sanitiseSpiritName(spiritName) {
  let spiritWords = spiritName.split(" ");
  let x = spiritWords.map((word) => {
    return word.replace("'s", "s").toLowerCase();
  });
  return x;
}

/**
 * send a message with the given spirit
 * @param {*} foundSpirit
 * @returns
 */
async function sendSpirit(mods, msg, foundSpirit) {
  // TODO: check if getting all spirit's uniques is still wanted
  if (mods.unique) {
    const uniques = foundSpirit.uniques;
    for (const unique of uniques) {
      let basePath = "https://sick.oberien.de/imgs/powers/";
      //msg.channel.send(basePath + unique  + '.webp');
    }
  } else if (mods.back) {
    return await msg.channel.send(foundSpirit.panel[1]);
  } else {
    return await msg.channel.send(foundSpirit.panel[0]);
  }
}
