/*
	A class that represents a deck of playing cards.
	The deck has 52 cards, though there is a half-hearted leaning
	toward a more general deck with any number.
	All of the comments assume that the deck is 52 cards (for simplicity),
	but most (if not all) of the code assumes an arbitrary number.

	Of course, only a deck with a number of cards that is a multiple of
	52 will have the same odds as a normal 52-card deck (see "Representation:")


	This class contains
	"shuffle", which randomizes the 52 card deck.
	an index to select the card,
	and a pop function that moves the index

	Note:
	cards are never "deleted"
	"dealing" is done by simply moving the index
	


		Representation:
		King, ace, 2 ... 9, 10, jack, queen
		0 1 2 3 4 5 6 7 8 9 10 11 12
		13 14 .. etc.
		13*4 = 52

		So a King is 0, 13, 26 and 39

		We can get the value of the card by mod13
		We can get the suit of the card by div13
		Here is a partial listing of the cards:
		0  1  2  3 . . .
		13 14 15 16 . . .
		26 27 28 29 . . .
		39 40 41 42 . . .
		
		Given the above,

		Here is transform using getValue:
		0 1 2 3 . . .
		0 1 2 3 . . .
		0 1 2 3 . . .
		0 1 2 3 . . .
		Here is transform using getSuit:
		0 0 0 0 . . .
		1 1 1 1 . . .
		2 2 2 2 . . .
		3 3 3 3 . . .







*/
function deck(x){
	this.cards = []; //x card deck

	this.numCards = x || 52;
	this.index = 0;




	/*
		The fisher-yates algorithm.
		Generate (and return) a random sequence (array) from 0 to x

		This is used to shuffle the deck, using an argument of 52.
	*/
	this.fisherYates = function(x){
		var arr = [];		//arr will be of size x (0...x-1)
		//make an ordered array
		for (var ii=0;ii<x;ii++){
			arr.push(ii);
		}
		//randomize the array
		for(var ii=x-1;ii>0;ii--){			//from x-1 (final element) to 1
			var rnd	 = Math.floor((Math.random()*(ii+1))); //get random on [0, ii]
			var temp = arr[rnd];	//swapem
			arr[rnd] = arr[ii];
			arr[ii]  = temp;
		}
		return arr;
	}


	/*
		Calls fisher yates so you don't have to.
	*/
	this.shuffle = function(){
		this.cards = this.fisherYates(this.numCards);
	}




	/*
		Pops the card. Basically nextCard() but increments the index
		as well.
	*/
	this.popCard = function(){
		//get the next card the index is pointing to
		var temp = this.getCard();
		//move the index
		this.increment();
		if(this.index == 0){	//increment caused it to roll around
			this.reset();
		}
		return temp;
	}
	


	/*
		Check cards array bounds for safety
		default argument is this.index
	*/
	this.inBounds = function(x){
		x = x || this.index;
		return (x < this.cards.length);
	}

	/*
		Get the card at x, or if x is unspecified,
		get the card at the index
	*/
	this.getCard = function(x){
		//return the card value
		return this.cards[(x || this.index)];
	}


	/*
		Shuffle the deck and move the index back to 0
	*/
	this.reset = function(){
		this.shuffle();
		this.index = 0;
	}



	/*
		Not sure these are actually going to be useful
	*/
	this.increment = function(){
		if(this.index < (this.cards.length - 1)){ // 0 <= this.index <= [50]
			this.index++;
			//console.log("incremented");
		}else{
			this.index = 0;			//wrap around
		}
	}
	this.decrement = function(){
		if(this.index > 0){			// 51 >= this.index > 0
			this.index--;
		}else{
			this.index = (this.cards.length-1)	//this.index = 51 (wrap around)
		}
	}


	/*

		Iterate through the deck,
		generating an array of strings of the form:

			(value)(suit)

		where
			(value) is the card's numerical value,
				or a character in {A, K, J, Q} if it is a face card
		and
			(suit) is the suit of the card.
	*/
	this.symbolicView = function(){
		var temp;
		var value;
		var suit;

		var outDeck = [];
		for(var ii = 0; ii < 52; ii++){
			outDeck.push(' '+deck.getSymbolic(this.getCard(ii))+' ');
		}

		return outDeck;

	}



}






//gets the value of the card for internal work
	deck.getValue = function(x){
		return x%13;
	}
//gets the suit of the card for internal work
	deck.getSuit = function(x){
		return Math.floor(x/13);
	}


//certain special values are face cards, all else just numerical
	deck.displayValue = function(value){
		switch(parseInt(value)){
			case 0:
				value = 'K';
				break;
			case 1:
				value = 'A';
				break;
			case 11:
				value = 'J';
				break;
			case 12:
				value = 'Q';
				break;
		}
		return value;

	}


//Return one of : ♠♤♥♡♣♧♦♢ depending on which of 4 numbers the arg is
	deck.displaySuit = function(suit){

		switch(parseInt(suit)){
			case 0:
				suit = '♠';
				break;
			case 1:
				suit = '♣';
				break;
			case 2:
				suit = '♥';
				break;
			case 3:
				suit = '♦';
				break;
		}
		return suit;
	}


//Change a card value into its symbolic form
	deck.getSymbolic = function(x){
		var str = "";
		str+=this.displayValue(this.getValue(x));
		str+=this.displaySuit(this.getSuit(x));
		return str;
	}







