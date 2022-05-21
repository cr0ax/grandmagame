import { PokerHands } from './pokerhands';
import { Deck } from './deck';


describe('Hand ranking test', () => {
  it('ranks one-pair', () => {
    expect(PokerHands.key[PokerHands.rank([0,13])]).toBe("one pair");
    expect(PokerHands.key[PokerHands.rank([1,14])]).toBe("one pair");
    expect(PokerHands.key[PokerHands.rank([11,24])]).toBe("one pair");
    expect(PokerHands.key[PokerHands.rank([12,25])]).toBe("one pair");
  });
  it('ranks straight A-5 as straight', () => {
    const hand = [1,2,3,4,18];
    // console.log(hand.map(card => Deck.getSymbolic(card)));
    expect(PokerHands.key[PokerHands.rank(hand)]).toBe("straight");
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
