// deckCalc.js
const { Deck, ADV } = require("./deck.js");

/**
 * Command that returns the invader deck setup for a given
 * adversary level
 */
module.exports = {
  name: "invaderdeck",
  description:
    "Calculates the invader deck for a given adversary/double adversary set up.",
  public: true, //has to be true to show as a command
  async execute(msg, args) {
    try {
      if (args.length < 2) {
        throw new Error(
          "Please specify at least one adversary and a numeric level (-invaderdeck prussia 6) or (-invaderdeck prussia 6 scotland 6).",
        );
      }

      let leadingAdversary = args[0];
      let leadingAdversaryLevel = parseInt(args[1]);

      if (
        isNaN(leadingAdversaryLevel) ||
        leadingAdversaryLevel < 1 ||
        leadingAdversaryLevel > 6
      ) {
        throw new Error("Please specify a numeric level between 1 and 6.");
      }

      let supportingAdversary, supportingAdversaryLevel;
      if (args.length >= 4) {
        supportingAdversary = args[2];
        supportingAdversaryLevel = parseInt(args[3]);

        if (
          isNaN(supportingAdversaryLevel) ||
          supportingAdversaryLevel < 1 ||
          supportingAdversaryLevel > 6
        ) {
          throw new Error(
            "Please specify a numeric level between 1 and 6 for the supporting adversary.",
          );
        }
      }

      const deck = new Deck();
      if (supportingAdversary) {
        deck.applyAdv(supportingAdversary, supportingAdversaryLevel);
      }
      deck.applyAdv(leadingAdversary, leadingAdversaryLevel);

      if (deck.cards.length === 0) {
        throw new Error("The resulting deck is empty.");
      }

      return msg.channel.send(deck.cards.join(", "));
    } catch (e) {
      console.log(e);
      return msg.channel.send(e.toString());
    }
  },
};
