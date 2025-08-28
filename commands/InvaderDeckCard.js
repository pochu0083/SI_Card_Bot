class InvaderDeckCard {
  constructor(stage, cardSymbol = null) {
    this.stage = stage;
    this.cardSymbol = cardSymbol ? cardSymbol : stage;
  }
}

module.exports = InvaderDeckCard;
