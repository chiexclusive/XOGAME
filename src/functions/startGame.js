//Start Game

//Dependencies
import SoundPlayer from "./soundPlayer.js";


//Variables
var box;
const sprites = {x: "<span data-id = 'ELEM_ID' class = 'fa fa-close'></span>", o: "<span data-id = 'ELEM_ID' class = 'fa fa-circle-o'></span>"};
var plays = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var states = {}; //{setUserWins, setOpponentWins, setUserTies, startTimer, stopTimer}
var ties, wins, lost;
ties = wins = lost = 0;
const soundPlayer = new SoundPlayer(new AudioContext());

function startGame (theStates) {
	//Empty States
	if(theStates.cleanState){
		theStates.setUserTies(0);
		theStates.setUserWins(0);
		theStates.setOpponentWins(0);
		theStates.stopTimer();
	}

	//Get states
	states = theStates;
	states.cleanState = false;

	//Set box
	box = document.querySelectorAll(".box");

	//Call new game
	newGame()

	//Start timer
	states.startTimer();

	//Handle start game differently for modes (single player || multiplayer)
	if(!window.gameData) return;

	//Handle for multiplayer
	if(window.gameData.multiplayer){}

	//Handel for single player
	if(!window.gameData.multiplayer){

		//Announce who starts first
		let mesg = window.gameData.firstMove + " makes the first move";
		announce(mesg);

		//Handle play
		if(window.gameData.firstMove.toString().toLowerCase() === "computer") return computerPlay()
		else return userPlay(); //Enable user play
	}
}

//Function for announcement
function announce(mesg){
	const notification = document.querySelector(".notification-text");
	notification.textContent = mesg;
	notification.parentElement.classList.add("show-notification");
	setTimeout(() => notification.parentElement.classList.remove("show-notification"), 5000);
}


//Enable user play
function userPlay() {
	//Make box clickable
	box.forEach((item, index) => item.addEventListener("click", handleUserPlay));
}

//Handle user play
function handleUserPlay(event) {
		
	if(window.gameData.sound === "yes"){
		soundPlayer.play(450.0, 13.8, "sine").stop(0.2);
	}


	//Check if play exist
	if(plays[event.target.getAttribute("data-id")] !== undefined) return;
	
	//Indicate play
	if(plays[event.target.getAttribute("data-id")] === undefined) event.target.innerHTML = sprites[window.gameData.sprite].replace("ELEM_ID", event.target.getAttribute("data-id"))
		
	//Add the sprite to the game play array
	plays[event.target.getAttribute("data-id")] = window.gameData.sprite;
	
	//End user Play
	endUserPlay();
}

async function endUserPlay() {
	
	//Remove event
	box.forEach((item, index) => item.removeEventListener("click", handleUserPlay));
	
	//Check for a win
	var won = await checkForWin(window.gameData.name);
	//Check is the game has ended
	var gameEnded = true;
	
	//If game not won handle tie
	if(!won) gameEnded = await gameHasEnded();


	//Call computer
	setTimeout(() => {
		if(!won && !gameEnded) computerPlay();
	}, 1500);
	
}


//End computer play
async function endComputerPlay() {
	
	//Check for a win
	var won = await checkForWin(window.gameData.opponent);
	//Check is the game has ended
	var gameEnded = true;
	
	//If game not won handle tie
	if(!won) gameEnded = await gameHasEnded();

	//Call user
	if(!won && !gameEnded) userPlay();
	
}




//Check for a win
function checkForWin (type) {

	return new Promise((resolve, reject) => {
		//Test for opponent win
		let sprite = window.gameData.opponent === type ? (window.gameData.sprite === "x"? "o": "x") : window.gameData.sprite;
		let result = winCombinations.find(combo => plays[combo[0]] === sprite && plays[combo[1]] === sprite && plays[combo[2]] === sprite);
		
		if(result === undefined) resolve(false);
		else{
			setTimeout(() => handleWin(result), 300);
			resolve(true);
		}
		
	})

}

//Handle win
function handleWin (winIndex) {
	//Indicate a win
	winIndex.forEach((item, index) => {
		box.forEach((boxItem, boxIndex) => {

			if(item !== undefined && boxItem.getAttribute("data-id") === item.toString()) boxItem.classList.add("blink-continious");
		})
		
	})

	if(plays[winIndex[0]] === window.gameData.sprite){
		wins++;
		states.setUserWins(wins);
		announce(window.gameData.name + " won this round");
	}else{
		lost++
		states.setOpponentWins(lost);
		announce(window.gameData.opponent + " won this round");
	}

	states.stopTimer();

	//Listen to user click to start new Game
	document.querySelector(".game-card").addEventListener("click", restart)
}

//restart game
function restart(){
	startGame(states);
}

//Restart Game
function newGame() {
	//Clear plays
	plays = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

	box.forEach((item, index) => item.classList.remove("blink-continious"))

	//Remove event
	document.querySelector(".game-card").removeEventListener("click", restart)

	//Remove the x and the o on the board
	box.forEach((item, index) => item.innerHTML = "");
}

//CHeck if game has ended
function gameHasEnded () {
	
	//Have all the play slot been allocated
	return new Promise((resolve, reject) => {
		let length = 0;
		plays.forEach((item, index) => {
			if(item !== undefined) length++;
		})
		
		if(length === 9){
			setTimeout(() => {
				announce("It's a tie");
				ties++
				states.setUserTies(ties);
				states.stopTimer();//Clear timer

				//Listen to user click to start new Game
				document.querySelector(".game-card").addEventListener("click", restart);
				return resolve(true);
				
			},500)
		}else resolve(false);
		
	})
}

//Play the move that computer have in mind
function playComputerMove (id) {
	//Add the sprite to the box
	box.forEach((item, index) => {
		if(id !== undefined && id.toString() === item.getAttribute("data-id")){
			item.innerHTML = sprites[(window.gameData.sprite === "x"? "o":"x")].replace("ELEM_ID", id);
		}
	})
	

	//Add the played move to the plays array
	plays[id] = window.gameData.sprite === "x"? "o":"x";
	
	endComputerPlay(); //End computer play
	
}

//Get the winning chance
function getWinningChance(forMe) {
	
	var chanceCombination = undefined;
	var id = undefined;
	
	//Loop through each win combination to get the right win combination
	winCombinations.forEach((winItem, winIndex) => {
		if(chanceCombination === undefined){
			//Get test item from plays
			const test = [];
			winItem.forEach((testItem, testIndex) => test.push(plays[testItem]));
			
			//Check if there are two sprite and one undefined values in the test
			//Try for computer sprite
			let sprite = window.gameData.sprite === "x" ? "o" : "x";
			if(forMe){
				let result = test.filter(val => val === sprite);

				if(result.length === 2 && test.includes(undefined)) chanceCombination = winItem;
				
			}else{
				
				// Try for o
				let result = test.filter(val => val === window.gameData.sprite);
				if(result.length === 2 && test.includes(undefined)) chanceCombination = winItem;
			}
			
		}
		
	})
	//Check if there is any win combination
	if(chanceCombination === undefined) return {isChance: false};

	
	//Check for the empty spot in the win combination
	chanceCombination.forEach((item, index) => {
		if(plays[item] === undefined) id = item;
	})
	

	return  {isChance: true, id}
}

//Enable computer play
async function  computerPlay() {

	switch(window.gameData.difficulty){
		case "Dummy": 
			//Play dummy for dummy difficulty
			computerDummyPlay();
			break;
		case "Novice": 
			//Play Novice for novice difficulty
			computerNovicePlay();
			break;
		case "Intermediate": 
			//Play Intermediate for Intermediate difficulty
			computerIntermediatePlay();
			break;
		case "Professional": 
			//Play Intermediate for Intermediate difficulty
			computerProfessionalPlay();
			break;
		case "Extreme": 
			//Play dummy for dummy difficulty
			computerExtremePlay();
			break;
		default:
			computerDummyPlay();
			break;
	}
	


}


//Computer dummy play
function computerDummyPlay() {
	//Play randomly in any available spot
	const availableSpot = [];
	plays.forEach((item, index) => {
		if(item === undefined) availableSpot.push(index);
	})

	//get a random number
	const rand = Math.floor(Math.random() * availableSpot.length);

	return playComputerMove(availableSpot[rand]);
}


//Computer novice play
async function computerNovicePlay () {
	//Play scenerios
	//Variables
	let computerSprite = window.gameData.sprite === "x"? "o": "x";

	//Check for a winning chance to win or blocl win
	let chance = getWinningChance(true); //Indicate Difficulty here
	
	//Play the move determined
	if(chance.isChance === true) return playComputerMove(chance.id);
	
	//Check if it is computer first move and determine to play at the center
	if(!plays.includes(computerSprite) && plays[4] !== window.gameData.sprite && !chance.isChance) return computerDummyPlay()
	
	//If the first move of user is at the center then play at the edge
	let userMoveCounts = 0;
	plays.forEach((item, index) => {
		if(item === window.gameData.sprite) userMoveCounts++;
	})
	
	if(!chance.isChance && userMoveCounts === 1 && plays.indexOf(window.gameData.sprite) === 4){
		
		const use = [1,3,7,9];
		let random = () => {
			return new Promise((resolve, reject) => {
				let rand = Math.floor(Math.random() * use.length);
				if(plays[use[rand]] === undefined) return resolve(rand);
				else random();
			})
			
		}
		
		let rand = await random();
		return playComputerMove(use[rand]);
	}else{
		return computerDummyPlay()
	}
}


//Computer extreme play
async function computerIntermediatePlay () {
	//Play scenerios
	//Variables
	let computerSprite = window.gameData.sprite === "x"? "o": "x";

	//Check for a winning chance to win or blocl win
	let chance = getWinningChance(true); //Indicate Difficulty here
	
	//Play the move determined
	if(chance.isChance === true) return playComputerMove(chance.id);
	
	//Check if it is computer first move and determine to play at the center
	if(!plays.includes(computerSprite) && plays[4] !== window.gameData.sprite && !chance.isChance) return playComputerMove(4);
	
	//If the first move of user is at the center then play at the edge
	let userMoveCounts = 0;
	plays.forEach((item, index) => {
		if(item === window.gameData.sprite) userMoveCounts++;
	})
	
	if(!chance.isChance && userMoveCounts === 1 && plays.indexOf(window.gameData.sprite) === 4){
		
		const use = [1,3,7,9];
		let random = () => {
			return new Promise((resolve, reject) => {
				let rand = Math.floor(Math.random() * use.length);
				if(plays[use[rand]] === undefined) return resolve(rand);
				else random();
			})
			
		}
		
		let rand = await random();
		return playComputerMove(use[rand]);
	}
	

	//Check for 2 ways and block it
	//|
	//v
	//Check if the total number of plays is 3 and computer is to make the next move
	if(plays.filter(play => play === undefined).length === 6 && plays.filter(play => play === window.gameData.sprite).length === 2){
		//Check if the two spot the user play is at the edge
		const map = [];
		const edge = [0,2,6,8];
		const options = [1,5,7,3];
		plays.forEach((item, index) => {
			if(item === window.gameData.sprite) map.push(index);
		})

		if(edge.find(x => x === map[0]) !== undefined && edge.find(x => x === map[1]) !== undefined){
			let rand = Math.floor(Math.random() * options.length);
			return playComputerMove(options[rand]);
			
		}

	}


	return computerDummyPlay()
	


}


//Computer extreme play
async function computerProfessionalPlay () {
	console.log("professional)")
	//Play scenerios
	//Variables
	let computerSprite = window.gameData.sprite === "x"? "o": "x";

	//Check for a winning chance to win or blocl win
	let chance = getWinningChance(true); //Indicate Difficulty here
	if(chance.isChance === false) chance = getWinningChance(false);
	
	//Play the move determined
	if(chance.isChance === true) return playComputerMove(chance.id);
	
	//Check if it is computer first move and determine to play at the center
	if(!plays.includes(computerSprite) && plays[4] !== window.gameData.sprite && !chance.isChance) return playComputerMove(4);
	
	//If the first move of user is at the center then play at the edge
	let userMoveCounts = 0;
	plays.forEach((item, index) => {
		if(item === window.gameData.sprite) userMoveCounts++;
	})
	
	if(!chance.isChance && userMoveCounts === 1 && plays.indexOf(window.gameData.sprite) === 4){
		
		const use = [1,3,7,9];
		let random = () => {
			return new Promise((resolve, reject) => {
				let rand = Math.floor(Math.random() * use.length);
				if(plays[use[rand]] === undefined) return resolve(rand);
				else random();
			})
			
		}
		
		let rand = await random();
		return playComputerMove(use[rand]);
	}
	
	//or

	//Check for the first move of the user to play anywhere apart from the edge
	userMoveCounts = 0;
	plays.forEach((item, index) => {
		if(item === window.gameData.sprite) userMoveCounts++;
	})
	

	if(!chance.isChance && userMoveCounts === 1 && plays.indexOf(window.gameData.sprite) === 4){
		
		const use = [1,5,7,3];
		let random = () => {
			return new Promise((resolve, reject) => {
				let rand = Math.floor(Math.random() * use.length);
				if(plays[use[rand]] === undefined) return resolve(rand);
				else random();
			})
			
		}

		let rand = await random();
		return playComputerMove(use[rand]);
	}

	//Check for 2 ways and block it
	//|
	//v
	//Check if the total number of plays is 3 and computer is to make the next move
	if(plays.filter(play => play === undefined).length === 6 && plays.filter(play => play === window.gameData.sprite).length === 2){
		//Check if the two spot the user play is at the edge
		const map = [];
		const edge = [0,2,6,8];
		const options = [1,5,7,3];
		plays.forEach((item, index) => {
			if(item === window.gameData.sprite) map.push(index);
		})

		if(edge.find(x => x === map[0]) !== undefined && edge.find(x => x === map[1]) !== undefined){
			let rand = Math.floor(Math.random() * options.length);
			return playComputerMove(options[rand]);
			
		}

	}
	


	//Loop through an array of combination where 2 slots are available out of 3
	//And determine to play randomly in any of the given slot
	const availableCombinations = [];
	//|
	//v
	//Get Available win combinations
	winCombinations.forEach((winItem, winIndex) => {
		const result = [];
		winItem.forEach((item, index) => result.push(plays[item]));

		const filter = result.filter(item => item === undefined);

		if(filter.length === 2) availableCombinations.push(winItem);
	})
	
	
	if(availableCombinations.length > 0){
		//Select random combination
		let randomCombinationIndex = Math.floor(Math.random() * availableCombinations.length);
		
		
		//Get the spot that has already been played
		var preventIndex;
		availableCombinations[randomCombinationIndex].forEach((item, index) => {
			if(plays[item] !== undefined) preventIndex = index;
		})
		

		var randomSpot;
		//Select a random spot in the combination
		function getRandomTwo() {
			let result = Math.floor(Math.random() * 2);
			if(result === preventIndex) getRandomTwo();
			else{
				randomSpot = result;
			}
		}
		getRandomTwo();

		//Play
		return playComputerMove(availableCombinations[randomCombinationIndex][randomSpot]);
	}


	//Play randomly for any other condition
	if(availableCombinations.length === 0){
		const remaining = [];
		plays.forEach((item, index) => {
			if(item === undefined) remaining.push(index);
		});
		let rand = Math.floor(Math.random() * remaining.length);
		
		return playComputerMove(remaining[rand]);
	} 
	

}



//Computer extreme play
async function computerExtremePlay () {
	//Play scenerios
	//Variables
	let computerSprite = window.gameData.sprite === "x"? "o": "x";

	//Check for a winning chance to win or blocl win
	let chance = getWinningChance(true); //Indicate Difficulty here
	if(chance.isChance === false) chance = getWinningChance(false);
	
	//Play the move determined
	if(chance.isChance === true) return playComputerMove(chance.id);
	
	//Check if it is computer first move and determine to play at the center
	if(!plays.includes(computerSprite) && plays[4] !== window.gameData.sprite && !chance.isChance) return playComputerMove(4);
	
	//If the first move of user is at the center then play at the edge
	let userMoveCounts = 0;
	plays.forEach((item, index) => {
		if(item === window.gameData.sprite) userMoveCounts++;
	})
	
	if(!chance.isChance && userMoveCounts === 1 && plays.indexOf(window.gameData.sprite) === 4){
		
		const use = [1,3,7,9];
		let random = () => {
			return new Promise((resolve, reject) => {
				let rand = Math.floor(Math.random() * use.length);
				if(plays[use[rand]] === undefined) return resolve(rand);
				else random();
			})
			
		}
		
		let rand = await random();
		return playComputerMove(use[rand]);
	}
	
	//or

	//Check for the first move of the user to play anywhere apart from the edge
	userMoveCounts = 0;
	plays.forEach((item, index) => {
		if(item === window.gameData.sprite) userMoveCounts++;
	})
	

	if(!chance.isChance && userMoveCounts === 1 && plays.indexOf(window.gameData.sprite) === 4){
		
		const use = [1,5,7,3];
		let random = () => {
			return new Promise((resolve, reject) => {
				let rand = Math.floor(Math.random() * use.length);
				if(plays[use[rand]] === undefined) return resolve(rand);
				else random();
			})
			
		}

		let rand = await random();
		return playComputerMove(use[rand]);
	}

	//Check for 2 ways and block it
	//|
	//v
	//Check if the total number of plays is 3 and computer is to make the next move
	if(plays.filter(play => play === undefined).length === 6 && plays.filter(play => play === window.gameData.sprite).length === 2){
		//Check if the two spot the user play is at the edge
		const map = [];
		const edge = [0,2,6,8];
		const options = [1,5,7,3];
		plays.forEach((item, index) => {
			if(item === window.gameData.sprite) map.push(index);
		})

		if(edge.find(x => x === map[0]) !== undefined && edge.find(x => x === map[1]) !== undefined){
			let rand = Math.floor(Math.random() * options.length);
			return playComputerMove(options[rand]);
			
		}

		//Another style
		const style = [[1,3], [1,5], [3,7], [5, 7]]
		const decision = [[0, 2, 6], [2,0,8], [6,0,8], [8, 6, 2]]
		return (
			style.forEach((item, index) => {
				if(item.find(x => x === map[0]) !== undefined && item.find(x => x === map[1]) !== undefined){
					return playComputerMove(decision[index][Math.floor(Math.random() * 3)]);
				}
			})
		)
	}
	


	//Loop through an array of combination where 2 slots are available out of 3
	//And determine to play randomly in any of the given slot
	const availableCombinations = [];
	//|
	//v
	//Get Available win combinations
	winCombinations.forEach((winItem, winIndex) => {
		const result = [];
		winItem.forEach((item, index) => result.push(plays[item]));

		const filter = result.filter(item => item === undefined);

		if(filter.length === 2) availableCombinations.push(winItem);
	})
	
	
	if(availableCombinations.length > 0){
		//Select random combination
		let randomCombinationIndex = Math.floor(Math.random() * availableCombinations.length);
		
		
		//Get the spot that has already been played
		var preventIndex;
		availableCombinations[randomCombinationIndex].forEach((item, index) => {
			if(plays[item] !== undefined) preventIndex = index;
		})
		

		var randomSpot;
		//Select a random spot in the combination
		function getRandomTwo() {
			let result = Math.floor(Math.random() * 2);
			if(result === preventIndex) getRandomTwo();
			else{
				randomSpot = result;
			}
		}
		getRandomTwo();

		//Play
		return playComputerMove(availableCombinations[randomCombinationIndex][randomSpot]);
	}


	//Play randomly for any other condition
	if(availableCombinations.length === 0){
		const remaining = [];
		plays.forEach((item, index) => {
			if(item === undefined) remaining.push(index);
		});
		let rand = Math.floor(Math.random() * remaining.length);
		
		return playComputerMove(remaining[rand]);
	} 
	

}

//Export start game functionality;
export default startGame;