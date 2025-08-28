// deck.test.js
const { Deck } = require('../commands/deckCalc.js');
const ad = require('../commands/AdversaryNames.js').ad;

describe('Deck class', () => {
  console.log(ad);
  console.log(ad.get('prussia'));
  it('should initialize with a default deck', () => {
    const deck = new Deck();
    expect(deck.cards).toEqual([1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
  });

  it('should apply an advancement rule', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 2);
    expect(deck.cards).not.toEqual([1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
  });

  it('should apply Russia 4 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('russia'), 4);
    expect(deck.cards).toEqual([1, 1, 1, 2, 3 ,2 ,3 ,2 ,3 ,2 ,3 ,3]);
  });

  it('should apply Prussia 2 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 2);
    expect(deck.cards).toEqual([1, 1, 1, 3, 2, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('should apply Prussia 3 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 3);
    expect(deck.cards).toEqual([1, 1, 3, 2, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('should apply Prussia 4 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 4);
    expect(deck.cards).toEqual([1, 1, 3, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('should apply Prussia 5 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 5);
    expect(deck.cards).toEqual([1, 3, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('should apply Prussia 6 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 6);
    expect(deck.cards).toEqual([3, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('should apply HLC 3 correctly', () => {
    const deck = new Deck();
    console.log(ad.get('habsburg'));
    deck.applyAdv(ad.get('habsburg'), 3);
    expect(deck.cards).toEqual([1,1,2,2,2,2,3,3,3,3,3]);
  });

  it('should apply Scotland 2 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('scotland'), 2);
    expect(deck.cards).toEqual([1, 1, 2, 2, 1, 'C', 2 , 3, 3, 3, 3, 3]);
  });

  it('should apply Scotland 4 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('scotland'), 4);
    expect(deck.cards).toEqual([1, 1, 2, 2, 3, 'C', 2 , 3, 3, 3, 3]);
  });

  it('should apply HME 4 correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('habsburgmining'), 4);
    expect(deck.cards).toEqual([1, 1, 1, 2, 'S', 2 , 2, 3, 3, 3, 3, 3]);
  });

  it('should handle adversaries with no deck modification correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('england'), 6);
    expect(deck.cards).toEqual([1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
  });

  it('should handle prussia SUPPORTING doubles with no deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 6);
    deck.applyAdv(ad.get('england'), 6);
    expect(deck.cards).toEqual([3, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('should handle prussia SUPPORTING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 6);
    deck.applyAdv(ad.get('russia'), 6);
    expect(deck.cards).toEqual([3, 2, 3, 2, 3, 2, 3, 3]);
  });

    it('should handle prussia LEADING doubles with no deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('england'), 6);
    deck.applyAdv(ad.get('prussia'), 6);
    expect(deck.cards).toEqual([3, 2, 2, 2, 3, 3, 3, 3]);
  });

  it('should handle prussia LEADING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('russia'), 6);
    deck.applyAdv(ad.get('prussia'), 6);
    expect(deck.cards).toEqual([3, 3, 2, 3, 2, 3, 2, 3]);
  });

  it('should handle HME SUPPORTING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('habsburgmining'), 6);
    deck.applyAdv(ad.get('prussia'), 6);
    expect(deck.cards).toEqual([3, 'S', 2, 2, 3, 3, 3, 3]);
  });

  it('should handle HME LEADING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 6);
    deck.applyAdv(ad.get('habsburgmining'), 6);
    expect(deck.cards).toEqual([3, 2, 'S', 2, 3, 3, 3, 3]);
  });

  it('should handle Russia LEADING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 6);
    deck.applyAdv(ad.get('russia'), 6);
    expect(deck.cards).toEqual([3, 2, 3,2,3,2,3,3]);
  });

  it('should handle Russia SUPPORTING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('russia'), 6);
    deck.applyAdv(ad.get('prussia'), 6);
    expect(deck.cards).toEqual([3,3,2,3,2,3,2,3]);
  });

  it('should handle Scotland LEADING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('prussia'), 6);
    deck.applyAdv(ad.get('scotland'), 6);
    expect(deck.cards).toEqual([2,2,3,'C',3,3,3,3]);
  });

  it('should handle Scotland SUPPORTING doubles with deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('scotland'), 6);
    expect(deck.cards).toEqual([1, 1, 2, 2, 3, 'C', 2 , 3, 3, 3, 3]);
    deck.applyAdv(ad.get('prussia'), 6);
    expect(deck.cards).toEqual([3,2,3,'C',2,3,3,3]);
  });

  it('should handle Scotland LEADING doubles with no deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('england'), 6);
    deck.applyAdv(ad.get('scotland'), 6);
    expect(deck.cards).toEqual([1, 1, 2, 2, 3, 'C', 2 , 3, 3, 3, 3]);
  });

  it('should handle Scotland SUPPORTING doubles with no deck changes correctly', () => {
    const deck = new Deck();
    deck.applyAdv(ad.get('scotland'), 6);
    expect(deck.cards).toEqual([1, 1, 2, 2, 3, 'C', 2 , 3, 3, 3, 3]);
    deck.applyAdv(ad.get('england'), 6);
    expect(deck.cards).toEqual([1, 1, 2, 2, 3, 'C', 2 , 3, 3, 3, 3]);
  });

  it('should accelerate the deck', () => {
    const deck = new Deck();
    const result = deck.accel();
    expect(result[0]).toBeGreaterThan(-1);
    expect(result[1]).toBe(1);
    expect(result[2]).not.toEqual([1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
  });

  it('should throw an error if the deck cannot be accelerated', () => {
    const deck = new Deck();
    deck.cards = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    expect(() => deck.accel()).toThrowError('No 1 or 2 found in deck');
  });

  // TODO: add tests for retrieving adversaries by nicknames
  // (need to extract logic for adversary nickname retrieval out first)

  // TODO: add tests for handling duplicate adversaries
});
