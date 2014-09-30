
/*
	A game of videoPoker...
	domId is the container that the game is put in charge of.
	
	The display is wasteful, but since it doesn't happen
	30 times a second, it's probably fine
*/

function videoPoker(domId){



///////////////////////////////////////////////////////////////

//important stuff
	this.d = new deck();
	this.d.shuffle();
	this.container = $('#'+domId);

	this.bank = 200; //new bank();
		//the bank class was thrown in to satisfy assignment criteria and didn't please me
		//it didn't function at all in firefox
		//but we can rebuild it, better, stronger, faster.
	this.currentBet = 0;	



//simple arrays
	//internal representation
	this.hand = [40, 14, 27, 14, 40];
	//which ones are selected?
	this.selected = [false, false, false, false, false];

	this.turn = true;



///////////////////////////////////////////////////////////////


//////////////////////////////////////functional////////////////////////////

//deal 5 cards into the hand
	this.deal = function(){
		for(var ii = 0; ii < 5; ii++){
			if(!this.selected[ii]){
				this.hand[ii] = (this.d.popCard());
			}
		}
	}



	this.container.click($.proxy(function(e){

		var sel = ($(e.target).attr('id'));

		if(!sel){ return; }

		if(!this.turn){
			if(sel != "deal"){
				this.selected[sel] = !this.selected[sel];
			}
		}else{
			if(sel.contains("bet")){
				this.bet(parseInt(sel[3]));
			}
		}
		if(sel == "deal"){
			this.takeTurn();
		}

		this.displayBoard();

	}, this));


	//
	$(window).bind("beforeunload", $.proxy(function(e){
		
	}, this)); 

///////////////////////////////////////////////////////////////



/*
	1) Cards are dealt
	2) Player may hold cards
	3) Cards are dealt
	4) Hand is evaluated
	5) Result is displayed
	6) Credits are payed out
	7) Upon hitting 'deal', return to (1)
*/


	this.takeTurn = function(){
		if(!this.turn){
			this.deal();
			this.payout();
		}else{
			this.selected = [false, false, false, false, false];
			this.deal();
		}
		this.turn = !this.turn;
	}


	this.bet = function(n){
		this.bank -= n;//.funds -= n;
		this.currentBet += n;
	}

	this.payout = function(){

		var rank = pokerHands.rank(this.hand);
		var multiplier = pokerHands.payoutMultiplier[rank];
		var payout = this.currentBet*multiplier;

		this.bank += (payout);//.funds += (payout);

		//this.bank.logFunds();
		this.currentBet = 0;

	}










///////////////////Display things://///////////////////////////



	/*
		Generate the 5 buttons that represent the hand
	*/
	this.displayHand = function(){
		var tr = $('<tr>', { id: "hand"});
		var td;
		for(var ii = 0; ii < 5; ii++){

			//make some brand new DOM stuff
			td = $('<td>');
			button = $('<button>', {id: ii});

			//make some text
			var text = deck.getSymbolic(this.hand[ii]);
			//put brackets on it if it is selected
			if(this.selected[ii]){
				text = "["+text+"]";
			}
			if(deck.getSuit(this.hand[ii]) >=2){
				button.css("color", "red");
			}

			//put it together
			button.html(text);
			td.html(button);
			tr.append(td);
		}
		return tr;
	}

	/*
		Generate some control buttons
	*/
	this.displayControls = function(){
		var tr = $('<tr>', { id: "controls"});

		if(this.turn){
			var dtd = $('<td>');		
			var deal = $('<button>', {id: "deal"});
			deal.html("reset");
			dtd.html(deal);
		}else{
			var dtd = $('<td>');		
			var deal = $('<button>', {id: "deal"});
			deal.html("deal");
			dtd.html(deal);
		}

		var b1td = $('<td>');		
		var bet1 = $('<button>', {id: "bet1"});
		bet1.html("bet");
		b1td.html(bet1);

		var b2td = $('<td>');		
		var bet2 = $('<button>', {id: "bet2"});
		bet2.html("bet2");
		b2td.html(bet2);

		var b3td = $('<td>');		
		var bet3 = $('<button>', {id: "bet3"});
		bet3.html("bet3");
		b3td.html(bet3);

		var b4td = $('<td>');		
		var bet4 = $('<button>', {id: "bet4"});
		bet4.html("bet4");
		b4td.html(bet4);


		tr.append(dtd);
		tr.append(b1td);
		tr.append(b2td);
		tr.append(b3td);
		tr.append(b4td);

		return tr;
	}



	this.displayBoard = function(){
		table = $('<table class=\"board\">');

		table.html(this.displayHand());
		table.append(this.displayControls());

		this.container.html(table);

		this.container.append("<br/>Current Funds: " + this.bank);
		this.container.append("<br/>Current Bet: " + this.currentBet);

		this.displayCommentary();

	}


	this.displayCommentary = function(){
		if(this.turn){
			this.container.append("<br/>Place your bet!");
		}else{
			this.container.append("<br/>You may hold some cards now");
		}
	}

///////////////////////////////////////////////////////////////


////////////////////////////initialization////////////////////

	//this.deal();
	this.displayBoard();
	this.container.focus();




/*
	//Test stuff:
	var temp2 = '';
	//var symbold = this.d.symbolicView();

	for(var ii=0; ii < 52; ii++){
		temp2 += ii+" "+this.d.getSymbolic(this.d.popCard())+"<br/>";	
	}
	$('.'+domId).html(temp2);
*/

	


}
