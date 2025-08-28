class Deck {
  constructor() {
    this.cards = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3];
  }

  /**
   * Returns an invader deck given an adversary and a level
   * @param {*} adv
   * @param {*} lvl
   * @param {*} strict
   */
  applyAdv(adv, lvl, strict = false) {
    if (!ADV[adv] || (!ADV[adv][lvl] && strict)) {
      throw new Error(`${adv} doesn't have ${lvl} rule`);
    }

    for (let i = 1; i <= lvl; i++) {
      if (ADV[adv][i]) {
        this.cards = ADV[adv][i](this.cards);
      }
    }
  }

  /**
   * "Accelerates" a deck -> i.e returns the deck with the top card removed
   * @returns
   */
  accel() {
    const index = this.cards.findIndex((card) => card === 1 || card === 2);
    if (index === -1) {
      throw new Error("No 1 or 2 found in deck");
    }

    const card = this.cards.splice(index, 1)[0];
    return [index, card, this.cards];
  }
}

const ADV = {
  prussia: {
    1: (d) => {
      return d;
    },
    // put one of the stage 3 cards between stage 1 and 2
    2: (d) => {
      const index = d.lastIndexOf(1) + 1;
      d.splice(index, 0, d.pop());
      if (d[d.length - 1] !== 3) {
        throw new Error("Bad 3 wasn't found");
      }
      return d;
    },
    3: (d) => {
      const index = d.indexOf(1);
      if (index != -1) {
        d.splice(index, 1);
      }
      return d;
    },
    4: (d) => {
      const index = d.indexOf(2);
      if (index != -1) {
        d.splice(index, 1);
      }
      return d;
    },
    5: (d) => {
      const index = d.indexOf(1);
      if (index != -1) {
        d.splice(index, 1);
      }
      return d;
    },
    6: (d) => {
      let newarr = d.filter((a) => a !== 1);
      return newarr;
    },
  },
  england: {
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
  sweden: {
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
  france: {
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
  livestock: {
    1: (d) => {
      return d;
    },
    2: (d) => {
      return d;
    },
    3: (d) => {
      if (d.includes(1)) {
        const index = d.indexOf(1);
        d.splice(index, 1);
      }
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
  russia: {
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
        if (card === 2) {
          acc.push(index);
        }
        return acc;
      }, []);
      indices.reverse().forEach((index) => {
        d.splice(index + 1, 0, d.pop());
        if (d[d.length - 1] !== 3) {
          throw new Error("Bad 3 wasn't found");
        }
      });
      return d;
    },
    1: (d) => {
      return d;
    },
    5: (d) => {
      return d;
    },
    1: (d) => {
      return d;
    },
    6: (d) => {
      return d;
    },
  },
  scotland: {
    1: (d) => {
      return d;
    },
    2: (d) => {
      const indices = d.reduce((acc, card, index) => {
        if (card === 2) {
          acc.push(index);
        }
        return acc;
      }, []);
      // replace the 3rd stage II card with Coastal card
      d[indices[2]] = "C";
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
      const index = d.lastIndexOf(1);
      if (index !== -1) {
        const stage3index = d.lastIndexOf(3);
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
  mining: {
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
        if (card === 2) {
          acc.push(index);
        }
        return acc;
      }, []);
      d[indices[1]] = "S";
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

module.exports = { Deck, ADV };
