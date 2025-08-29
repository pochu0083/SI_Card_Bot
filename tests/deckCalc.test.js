// deck.test.js
const InvaderDeckCard = require("../commands/InvaderDeckCard.js");
const Deck = require("../commands/Deck.js");
const ad = require("../commands/AdversaryNames.js").ad;

describe("Deck class", () => {
  it("should initialize with a default deck", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply an advancement rule", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("prussia"), 2);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).not.toEqual(expectedCards);
  });

  it("should apply Russia 4 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("russia"), 4);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply Prussia 2 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("prussia"), 2);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply Prussia 3 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("prussia"), 3);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply Prussia 4 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("prussia"), 4);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply Prussia 5 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("prussia"), 5);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply Prussia 6 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("prussia"), 6);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply HLC 3 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("habsburg"), 3);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply HLC 5 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(0, "Wave of Immigration Reminder"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("habsburg"), 5);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply Scotland 2 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("scotland"), 2);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply Scotland 4 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("scotland"), 4);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should apply HME 4 correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2, "S"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("habsburgmining"), 4);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle adversaries with no deck modification correctly", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    deck.applyAdv(ad.get("england"), 6);
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle prussia SUPPORTING doubles with no deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("prussia"), 6);
    deck.applyAdv(ad.get("england"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle prussia SUPPORTING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("prussia"), 6);
    deck.applyAdv(ad.get("russia"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle prussia LEADING doubles with no deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("england"), 6);
    deck.applyAdv(ad.get("prussia"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle prussia LEADING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("russia"), 6);
    deck.applyAdv(ad.get("prussia"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle HME SUPPORTING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("habsburgmining"), 6);
    deck.applyAdv(ad.get("prussia"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "S"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle HME LEADING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("prussia"), 6);
    deck.applyAdv(ad.get("habsburgmining"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2, "S"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Russia LEADING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("prussia"), 6);
    deck.applyAdv(ad.get("russia"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Russia SUPPORTING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("russia"), 6);
    deck.applyAdv(ad.get("prussia"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland LEADING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("prussia"), 6);
    deck.applyAdv(ad.get("scotland"), 6);
    const expectedCards = [
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland SUPPORTING doubles with deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 6);
    const expectedCards1 = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards1);
    deck.applyAdv(ad.get("prussia"), 6);
    const expectedCards2 = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards2);
  });

  it("should handle Scotland 2 SUPPORTING Prussia 2 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("prussia"), 2);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 2 SUPPORTING Prussia 3 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("prussia"), 3);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 2 SUPPORTING Prussia 4 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("prussia"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 2 SUPPORTING Prussia 4 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("prussia"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 2 SUPPORTING Prussia 5 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("prussia"), 5);
    const expectedCards = [
      new InvaderDeckCard(2),
      new InvaderDeckCard(1),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 2 SUPPORTING Prussia 6 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("prussia"), 6);
    const expectedCards = [
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 2 SUPPORTING Russia 4 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("russia"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 4 SUPPORTING Russia 4 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 4);
    deck.applyAdv(ad.get("russia"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 2 SUPPORTING HME 4 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 2);
    deck.applyAdv(ad.get("habsburgmining"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2, "S"),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland 4 SUPPORTING HME 4 correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 4);
    deck.applyAdv(ad.get("habsburgmining"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2, "S"),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland LEADING doubles with no deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("england"), 6);
    deck.applyAdv(ad.get("scotland"), 6);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
  });

  it("should handle Scotland SUPPORTING doubles with no deck changes correctly", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 6);
    const expectedCards1 = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards1);
    deck.applyAdv(ad.get("england"), 6);
    expect(deck.cards).toEqual(expectedCards1);
  });

  // TODO: add tests for acceleration (should check that lowest possible phase
  // is remove correctly)

  // TODO: add tests for retrieving adversaries by nicknames
  // (need to extract logic for adversary nickname retrieval out first)

  // TODO: add tests for handling duplicate adversaries

  // tests for deck formatting
  it("should handle deck formatting for basic deck", () => {
    const deck = new Deck();
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
    expect(deck.formattedDeck()).toEqual("111-2222-33333");
  });

  it("should handle deck formatting for Prussia", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("prussia"), 6);
    const expectedCards = [
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
    expect(deck.formattedDeck()).toEqual("3-222-3333");
  });

  it("should handle deck formatting for Russia", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("russia"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
    expect(deck.formattedDeck()).toEqual("111-2-3-2-3-2-3-2-33");
  });

  it("should handle deck formatting for Scotland", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("scotland"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(2, "C"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
    expect(deck.formattedDeck()).toEqual("11-22-3-C2-3333");
  });

  it("should handle deck formatting for HME", () => {
    const deck = new Deck();
    deck.applyAdv(ad.get("habsburgmining"), 4);
    const expectedCards = [
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(1),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2, "S"),
      new InvaderDeckCard(2),
      new InvaderDeckCard(2),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
      new InvaderDeckCard(3),
    ];
    expect(deck.cards).toEqual(expectedCards);
    expect(deck.formattedDeck()).toEqual("111-2S22-33333");
  });
});
