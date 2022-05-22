import React from 'react';
import { useState } from 'react';
import { Deck } from './deck';
import { PokerHands } from './pokerhands';
import {createUseStyles} from 'react-jss';

enum GameState {
	Initialized,
	Selecting,
	Complete,
};

const PINK = "rgb(255, 140, 156)";
const BLUE = "rgb(66, 218, 218)";

const useBoardStyles = createUseStyles({
	board: {
		width: "500px",
		height: "200px",	
		display: "flex",
		flexDirection: 'column',
		justifyContent: 'space-between',
		// border: 'dashed 2px red',
		boxSizing: 'border-box',
		padding: "5px",
		color: BLUE,
		fontFamily: "courier monospace",
		fontStyle: "italic",
		fontWeight: "bold",
		letterSpacing: "2px",
		textShadow: `0.8px 0.8px 0 ${PINK}`
	},
	score: {
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	displayBox: {
		display: "flex",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	controls: {
		display: "flex",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'end',
		'& button': {
			fontSize: "20px",
		}
	},
});

const INITIAL_HAND = [40, 14, 27, 14, 40];
const INITIAL_SELECTION = [false, false, false, false, false];

export function VideoPoker(){
	let [payoutText, setPayoutText] = useState('');
	let [points,setPoints] = useState(200);
	let [currentBet,setCurrentBet] = useState(0);
	let [currentHand,setCurrentHand] = useState(INITIAL_HAND);
	let [currentGameState,setCurrentGameState] = useState(GameState.Initialized);
	let classes = useBoardStyles();

	let [selection,setSelection] = useState(INITIAL_SELECTION);
	const [deck,setDeck] = useState(new Deck());

	// deal cards for any slot if the current card is not selected
	function dealCards(){
		const tempHand = [];
		for(var ii = 0; ii < 5; ii++){
			tempHand[ii] = currentHand[ii];
			if(!selection[ii]){
				tempHand[ii] = (deck.popCard());
			}
		}
		setCurrentHand(tempHand);
		return tempHand;
	}

	function toggleCard(i: number){
		if(currentGameState !== GameState.Selecting) { return; }
		let tempSelection = [...selection];
		tempSelection[i] = !tempSelection[i];
		setSelection(tempSelection);
	}

	function bet(n: number){
		setPoints(points - n);
		setCurrentBet(currentBet + n);
	}

	function payout(hand){
		var rank = PokerHands.rank(hand);
		var multiplier = PokerHands.payoutMultiplier[rank];
		var payout = currentBet*multiplier;
		setPayoutText(`Hand: ${PokerHands.key[rank]}, Paid: ${payout}`);
		setPoints(points + payout);
		setCurrentBet(0);
	}

	function actionButtonText() {
		switch(currentGameState) {
			case GameState.Initialized: return "Deal"
			case GameState.Selecting: return "Deal"
			case GameState.Complete: return "Reset"
		};
	}

	function hintText() {
		switch(currentGameState) {
			case GameState.Initialized: return "Place your bet"
			case GameState.Selecting: return "Click cards to hold"
			case GameState.Complete: return payoutText
		};
	}

	function nextState() {
		if(currentGameState === GameState.Initialized){
			// re-init deck, deal cards and move to selection phase
			deck.shuffle();
			setDeck(deck);
			dealCards();
			setCurrentGameState(GameState.Selecting);
		}
		else if(currentGameState === GameState.Selecting){
			// deal cards again, payout, and move to complete
			const finalHand = dealCards();
			payout(finalHand);
			setCurrentGameState(GameState.Complete);
		}
		else if(currentGameState === GameState.Complete){
			// don't do anything, just reset
			setCurrentHand(INITIAL_HAND);
			setSelection(INITIAL_SELECTION);
			setCurrentGameState(GameState.Initialized);
		}
	}
	console.log("render main board");
	return (
		<div className={classes.board}>
		<div className={classes.score}>
			<div>Bank: {points}</div>
			<div>One-Pair is Jacks or Better</div>
			<div>Current Bet: {currentBet}</div>
		</div>
		<CardRow cards={currentHand} selection={selection} handler={toggleCard} />
		<div className={classes.displayBox}>
			<div>{hintText()}</div>
			<div className={classes.controls}>
			<button disabled={currentBet === 0 && currentGameState !== GameState.Complete} onClick={nextState}>{actionButtonText()}</button>
			{ currentGameState === GameState.Initialized && (<button onClick={() => bet(-1)}>Bet -</button>) }
			{ currentGameState === GameState.Initialized && (<button onClick={() => bet(1)}>Bet +</button>) }
			</div>
		</div>
		</div>
	);
}

const useCardRowStyles = createUseStyles({
	selected: {
		border: 'dashed 5px orange',
	},
	card: {
		width: "20%",
		height: "50px",
		fontSize: "25px",
		fontWeight: "bold",
	},
	red: {
		color: 'red',
	}
});
function CardRow(props: {cards: number[], selection: boolean[], handler: (i:number) => void}) {
	const classes = useCardRowStyles();
	console.log("Render card row");
	const selected = (idx: number) => props.selection[idx] ? classes.selected : '';
	const suit = (value: number) => Deck.getSuit(value) >= 2 ? classes.red : '';
	return (<div>
	{props.cards.map((card,idx) => (
		<button
			onClick={() => props.handler(idx)}
			className={suit(card) + ' ' + classes.card + ' ' + selected(idx)}
		>
		 {Deck.getSymbolic(card)}
		</button>
	))}
	</div>);
}

