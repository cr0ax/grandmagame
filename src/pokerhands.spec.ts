import { PokerHands } from './pokerhands';
import { Deck } from './deck';


describe('Hand ranking test', () => {
  it('ranks one-pair', () => {
    // kings
    expect(PokerHands.key[PokerHands.rank([0,13])]).toBe("one pair");
    expect(PokerHands.key[PokerHands.rank([13,26])]).toBe("one pair");
    expect(PokerHands.key[PokerHands.rank([26,39])]).toBe("one pair");
    // aces
    expect(PokerHands.key[PokerHands.rank([1,14])]).toBe("one pair");
    expect(PokerHands.key[PokerHands.rank([14,27])]).toBe("one pair");
    expect(PokerHands.key[PokerHands.rank([27,40])]).toBe("one pair");

    const hand = [36,45,27,1,48];
    console.log(hand.map(card => Deck.getSymbolic(card)));
    expect(PokerHands.key[PokerHands.rank(hand)]).toBe("one pair");
  });
  it('ranks straight A-5 as straight', () => {
    const hand = [1,2,3,4,18];
    // console.log(hand.map(card => Deck.getSymbolic(card)));
    expect(PokerHands.key[PokerHands.rank(hand)]).toBe("straight");
  });
  it('ranks trips', () => {
    for(let i = 0; i < 13; i++) {
      expect(
        PokerHands.key[PokerHands.rank([i,i+13,i+(13*2)])]
      ).toBe("3 of a kind");
    }
  });
  it('ranks quads', () => {
    for(let i = 0; i < 13; i++) {
      expect(
        PokerHands.key[PokerHands.rank([i,i+13,i+(13*2),i+(13*3)])]
      ).toBe("4 of a kind");
    }
  });
  it('ranks [k,a,2,3,4] as high card A', () => {
    const hand = [0,1,2,3,17];
    // console.log(hand.map(card => Deck.getSymbolic(card)));
    const rank = PokerHands.rank(hand);
    expect(PokerHands.key[rank]).toBe("high card");
    expect(PokerHands.highCard(hand)).toBe(14);
  });
  it('ranks flush', () => {
    expect(PokerHands.key[PokerHands.rank([0,1,2,3,4])]).toBe("flush");
  });
  it('ranks full house', () => {
    expect(PokerHands.key[PokerHands.rank([0,13,3,16,29])]).toBe("full house");
  });
  it('ranks royal flush', () => {
    expect(PokerHands.key[PokerHands.rank([10,11,12,0,1])]).toBe("royal flush!");
  });
});
