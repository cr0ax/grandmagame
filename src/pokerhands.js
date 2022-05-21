import { Deck as deck } from './deck';
/*
	Classify an array as a certain poker hand,
	rank poker hands against each other.
*/
function pokerHands(){}
/*
		King, ace, 2 ... 9, 10, jack, queen
		0 1 2 3 4 5 6 7 8 9 10 11 12
*/

/////////////////////Some array utilities//////////////////////////////////

	// allEqual = function(){
	// 	for(var ii = 0; ii < arguments.length; ii++){
	// 		if(arguments[0] != arguments[ii]){
	// 			return false;
	// 		}
	// 	}
	// 	return true;
	// }

	//looks like it attaches "all equal" to Array...
	//also serves to show the value of commenting your work when you actually do it...
	Array.prototype.homogenous = function(){
		for(var ii = 0; ii < this.length; ii++){
			if(this[0] != this[ii]){
				return false;
			}
		}
		return true;
	}

	//assumes the array has been sorted in descending order
	//allows duplicate entries
	Array.prototype.inOrder = function(){

		for(var ii = 1; ii < this.length; ii++){
			if(	this[ii] != (this[ii-1] - 1 ) &&
				this[ii] != (this[ii-1])
			){
				return false;
			}
		}
		return true;
	}


	Array.prototype.removeDuplicates = function(){
		var temp = [];
		for(var ii = 0; ii < this.length; ii++){
			var cur = this[ii];
			if(temp.indexOf(cur) == -1){
				temp.push(cur);
			}
		}
		return temp;
	}

	/*
		Return the highest non-zero that
		occurs n times in the array.
		If there isn't one, default to -1
	*/
	Array.prototype.matching = function(n){
		var temp = this.sort(function(a,b){return b-a});

		for(var ii = 0; ii < temp.length-(n-1); ii++){
			if(temp.slice(ii, ii+n).homogenous()){
				return temp[ii];
			}
		}
		return -1;
	}



////////////////////utility functions for poker hands//////////////////////


	//moves king and ace values to their rightful places
	//operates on 1 "card" at a time
	pokerHands.pointValue = function(a){
		a = parseInt(a);
		if(a<2){
			return a+13;
		}
		return a;
	}


	//change a hand into a (sorted) array of point values
	pokerHands.valuate = function(cardArray){
		var retArray = [];
		for(var ii = 0; ii < cardArray.length; ii++){
			retArray[ii] = pokerHands.pointValue(deck.getValue(cardArray[ii]));
		}
		return retArray.sort(function(a,b){return b-a});
	}

	//change a hand into a (sorted) array of point values
	pokerHands.valuateAceLow = function(cardArray){
		var retArray = [];
		for(var ii = 0; ii < cardArray.length; ii++){
            var value = pokerHands.pointValue(deck.getValue(cardArray[ii]));
            if(value === 14) { value = 1; }
			retArray[ii] = value;
		}
		return retArray.sort(function(a,b){return b-a});
	}
	
	//change a hand into a (sorted) array of suits 1-4
			//(0 is not friendly round these parts)
	pokerHands.color = function(cardArray){
		var retArray = [];
		for(var ii = 0; ii < cardArray.length; ii++){
			retArray[ii] = deck.getSuit(cardArray[ii]) + 1; //0 is not friendly to everything else
		}
		return retArray.sort(function(a,b){return b-a});
	}


////////////////functions that determine hands/////////////////////////////


	/*
		Return the highest card in the hand

		Returns a value from 2 to 14 (2 to A)
	*/
	pokerHands.highCard = function(cardArray){
		var temp = pokerHands.valuate(cardArray);
		return temp[0];
	}


	


	/*
		If there are two or more distinct pairs of values
		in this hand, return the values of the highest of the two.
		else return -1
	*/
	pokerHands.twoPair = function(cardArray){
		var highPair = pokerHands.onePair(cardArray);
		var temp = pokerHands.valuate(cardArray).filter(function(a){return (a != highPair)});
		if(temp.matching(2) != -1){
			return highPair;
		}
		return -1;
	}


	/*
		Return a value from 2 to 14 (2 to A)
		representing the highest pair in the hand
		return -1 if there is not a pair in the hand
	*/
	pokerHands.onePair = function(cardArray){
		var temp = pokerHands.valuate(cardArray);
		return temp.matching(2);
	}
	/*
		Determines if the hand contains 3 of a kind
		Returns the value of the 3 of a kind.
	*/
	pokerHands.trips = function(cardArray){
		var temp = pokerHands.valuate(cardArray);
		return temp.matching(3);
	}
	/*
		Determines if the hand contains 4 of a kind
		Returns the value of the four of a kind.
	*/
	pokerHands.quads = function(cardArray){
		var temp = pokerHands.valuate(cardArray);
		return temp.matching(4);
	}

	/*
		Determines if a hand contains a full house
		by leveraging the trips and onePair functions
	*/
	pokerHands.fullHouse = function(cardArray){
		var highTrip = pokerHands.trips(cardArray); //get the high trips
		var temp = pokerHands.valuate(cardArray).filter(function(a){return (a != highTrip)});
		if(pokerHands.onePair(temp) != -1){
			return highTrip;
		}
		return -1;
	}
	/*
		Determines if the hand contains 5 cards in a row
        Returns the highest of them
	*/
	pokerHands.straight = function(cardArray){
		var tempAceHigh = pokerHands.valuate(cardArray).removeDuplicates();
		var tempAceLow = pokerHands.valuateAceLow(cardArray).removeDuplicates();
        var length = tempAceLow.length;
		var retVal = -1;
		for(var ii = 0; ii < length-4; ii++){
			if(tempAceHigh.slice(ii, ii+5).inOrder()){
				return tempAceHigh[ii];
			}
			if(tempAceLow.slice(ii, ii+5).inOrder()){
				return tempAceLow[ii];
			}
		}
		return retVal;
	}

	/*
		Determines if the hand contains five cards of the same suit
	*/
	pokerHands.flush = function(cardArray){
		var temp = pokerHands.color(cardArray);
		return (temp.matching(5) != -1);
	}

	/*
		A straight flush - a hand which will evaluate as
		a flush and a straight : /
	*/
	pokerHands.straightFlush = function(cardArray){
		var str8 = pokerHands.straight(cardArray);
		var flsh = pokerHands.flush(cardArray);
		if((str8 != -1) && flsh){
			return str8;
		}
		return -1;
	}

	/*
		A royal flush - a hand which evaluates as a
		straight flush and has a high card of A (14)
	*/
	pokerHands.royalFlush = function(cardArray){
		return ((pokerHands.straightFlush(cardArray) == 14) ? 14 : -1);
	}




///////////////////////////////////////////////////////////////////////////




	/*
		This is a hand ranker (0-9).
			The rank for "one pair" uses a comparison >=11, which is a "Jack".
			Thus, this ranker is for "jacks or better", a common form of video poker.


		Please note:
		This function can rank /different/ hands against each other
		it CANNOT decide which of two similar hands is the better
			eg it will NOT tell which is the better full house
	*/
	pokerHands.rank = function(cardArray){

		if(pokerHands.royalFlush(cardArray) != -1){
			return 9;
		}
		if(pokerHands.straightFlush(cardArray) != -1){
			return 8;
		}
		if(pokerHands.quads(cardArray) != -1){
			return 7;
		}
		if(pokerHands.fullHouse(cardArray) != -1){
			return 6;
		}
		if(pokerHands.flush(cardArray)){
			return 5;
		}
		if(pokerHands.straight(cardArray) != -1){
			return 4;
		}
		if(pokerHands.trips(cardArray) != -1){
			return 3;
		}
		if(pokerHands.twoPair(cardArray) != -1){
			return 2;
		}
        const onePair = pokerHands.onePair(cardArray);
        if(onePair >= 11 || onePair === 0 || onePair === 1) { // (jacks or better or A or K)
			return 1;
		}

		return 0;

	}


	pokerHands.key =['high card', 'one pair', 'two pair',
				'3 of a kind', 'straight', 'flush',
				'full house', '4 of a kind', 'straight flush',
				'royal flush!'
			];

	//nothing, 1 pair jacks or better, 2 pair, 3 of a kind, straight...
	pokerHands.payoutMultiplier = [0,1,2,3,4,6,9,25,50,250];


export const PokerHands = pokerHands;
