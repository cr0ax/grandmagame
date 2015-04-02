grandmagame
===========

####what?

A deck of cards written in javascript and some helpers for game-playing

I wrote it for a javascript class...

####lost?

The base deck class is <a href="deck.class.js">here</a>

Some utility functions for ranking poker hands can be found <a href="pokerhands.class.js">here</a>

Here is the eponymous game, it's <a href="videopoker.class.js">jacks or better video poker</a>

####how to?

Deck class provides
```javascript
deck()    //constructor
shuffle() //shuffle the deck
reset()   //shuffle and reset the index (probably what you wanted when you called shuffle()...)
popCard() //pop the next card off the top
getCard() //just look at the next card (peek)
displayValue() //return a human readable value, eg, one of 2-9, AKQJ
displaySuit()   //return a human readable suit: unicode ♠♤♥♡♣♧♦♢
getValue() //return the internal card number
getSuit()  //return the internal suit number
getSymbolic() //combines displayValue and displaySuit
symbolicView() //call getSymbolic on every card and return a deck of those
```

####why "grandma game"?

My grandma liked video poker
