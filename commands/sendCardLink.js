const levenshtein = require("js-levenshtein");
const draw = require("./draw.js");
const csvLoader = require("./loadCardCsv.js");

function getCardName(input, availableNames, weightOfSizediff = 0.8) {
  var target = cleanInput(input);
  var perfectMatches = getPerfectMatch(target, availableNames);

  console.log(target, perfectMatches);

  if (perfectMatches.length === 1) {
    return perfectMatches[0];
  } else if (perfectMatches.length > 1) {
    return getCardNameHelper(target, perfectMatches, weightOfSizediff);
  } else {
    return getCardNameHelper(target, availableNames, weightOfSizediff);
  }
}

function getCardNameHelper(input, availableNames, weightOfSizediff) {
  var result = null;
  var closestDistance = 999;

  for (var name of availableNames) {
    var sizeDiff = name.length > input.length ? name.length - input.length : 0;
    var distance = levenshtein(input, name) - sizeDiff * weightOfSizediff;
    if (distance < closestDistance) {
      closestDistance = distance;
      result = name;
    }
  }
  return result;
}

function getPerfectMatch(input, availableNames) {
  var result = [];
  for (var name of availableNames) {
    if (name.includes(input)) {
      result.push(name);
    }
  }
  return result;
}

/**
 * Returns the SICK link given a card name
 * @param {*} msg
 * @param {*} input
 * @param {*} availableNames
 * @param {*} basePath
 * @param {*} aliases
 * @returns
 */
async function sendCardLink(
  msg,
  input,
  availableNames,
  basePath,
  aliases = {},
) {
  var cardName = getCardName(
    input,
    [].concat(availableNames).concat(Object.keys(aliases)),
  );
  if (cardName) {
    if (cardName in aliases) {
      if (typeof aliases[cardName] === "string") {
        cardName = aliases[cardName];
        // handling cases where event cards share an alias
      } else {
        const matches = draw.capitalizeTheFirstLetterOfEachWord(
          aliases[cardName],
        );
        var message = "Your search matched several cards, please specify:";
        message += matches.map((s) => "\n- " + s).join("");
        return await msg.channel.send(message);
      }
    }
    return await msg.channel.send(basePath + cardName + ".webp");
  } else {
    return await msg.channel.send("Incorrect name, try using -search");
  }
}

function cleanInput(args) {
  var card_name = args.toString().toLowerCase();
  return card_name
    .replace("-", "")
    .replace("\'", "")
    .replace(",", "_")
    .replace(" ", "_");
}

/**
 * Resolve card from CSV and send URL (or list if alias matches multiple).
 * typeFilter: 'major' | 'minor' | 'unique' | 'power' | 'event' | 'fear' | 'blight' | null (all)
 */
async function sendCardLinkFromCsv(msg, input, typeFilter = null) {
  const { nameToRow, aliasToRows, loaded } = csvLoader.loadCardCsv();
  if (!loaded) {
    return await msg.channel.send(
      "Card data not loaded. Add data/cards.csv (run: node exportCardsCsv.js) or set CARDS_CSV.",
    );
  }
  const availableNames = csvLoader.getAllSearchNames(typeFilter);
  const cardName = getCardName(input, availableNames);
  if (!cardName) {
    return await msg.channel.send("Incorrect name, try using -search");
  }
  const rowByName = nameToRow[cardName];
  if (rowByName) {
    return await msg.channel.send(rowByName.url);
  }
  const rowsByAlias = aliasToRows[cardName];
  if (rowsByAlias) {
    if (rowsByAlias.length === 1) {
      return await msg.channel.send(rowsByAlias[0].url);
    }
    const matches = draw.capitalizeTheFirstLetterOfEachWord(rowsByAlias.map((r) => r.name));
    var message = "Your search matched several cards, please specify:";
    message += matches.map((s) => "\n- " + s).join("");
    return await msg.channel.send(message);
  }
  return await msg.channel.send("Incorrect name, try using -search");
}

module.exports = {
  getCardName: getCardName,
  sendCardLink: sendCardLink,
  sendCardLinkFromCsv: sendCardLinkFromCsv,
};
