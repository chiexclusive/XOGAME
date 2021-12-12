//Game area
import "./../stylesheets/GameArea.css"
import {useEffect, useState} from "react";
import startGame from "./../functions/startGame";
import PausedGameMenu from "./PausedGameMenu.js"
function GameArea (props) {

	const [ellipsis, setEllipsis] = useState("");
	const [timer, setTimer] = useState("00.00");
	const [username, setUserName] = useState("Chiboy");

	//Score state
	const [opponent, setOpponent] = useState("");
	const [userWins, setUserWins] = useState(0);
	const [opponentWins, setOpponentWins] = useState(0);
	const [userTies, setUserTies] = useState(0);

	//Paused menu state
	const [isPaused, setIsPaused] = useState(false);
	const [restart, setRestart] = useState(false);

	var interval;
	var timeInterval;

	const stopTimer = () => {
		console.log('timer stopped')
		clearInterval(timeInterval)
	}

	//Handle restart
	useEffect(() => {
		if(restart){
			startGame({setUserWins, setOpponentWins, setUserTies, startTimer, stopTimer, cleanState: true, quit})
		}
	}, [restart])


	useEffect(() => {
		if(!isPaused){
			document.querySelector("#parent-container").classList.remove("go-from");
			document.querySelector(".game-card").classList.remove("reverse-straighten");
		}
	}, [isPaused])


	useEffect(() => {
		AnimateStarting();
		setTimeout(() => {
			cancelAnimateStarting();

			//Load Game data
			
			//Prevent running if ther is no game data
			if(window.gameData === undefined) return;

			//Set the repective states
			setUserName(window.gameData.name);
			setOpponent(window.gameData.opponent);
			setTimeout(() => {
				startGame({setUserWins, setOpponentWins, setUserTies, startTimer, stopTimer, cleanState: true, quit});
				document.querySelector(".difficulty-box").textContent = window.gameData.difficulty;
			}, 1000);
		}, 5000)
	}, [])

	const AnimateStarting = () => {
		var el = "";
		interval = setInterval(async () => {
			setEllipsis(el);
			el = el + ".";

			if(el === "...."){
				el = "";
			}
		}, 500);
	}

	const cancelAnimateStarting = () => {
		clearInterval(interval);
		const loadPage = document.querySelector(".game-load");
		const game = document.querySelector(".game");
		game.style.display = "block";
		loadPage.style.display = "none";
	}

	const startTimer = (time) => {
		console.log("timer started")
		var time = 0
		timeInterval = setInterval(() => {
			time = time + 1

			//Format the time

			//Get Hour
			let hour = time/(60*60);
			hour = Math.floor(hour);
			hour = (hour === 0) ? "" : (hour.toString().length === 1)? "0"+hour+ ":": hour + ":";

			//Get Minute
			let minute = time%(60*60) / 60;
			minute = Math.floor(minute);
			minute = (minute === 0)? "00:": (minute.toString().length === 1)? "0"+minute+ ":": minute + ":"


			let second = (time%(60*60))%60;
			second = Math.floor(second);
			second = (second === 0)? "00": (second.toString().length === 1)? "0"+second: second;
			let output = hour + minute + second;

			setTimer(output);

		}, 1000)
	}



	const getPausedGameOptions = (event) => {
		document.querySelector("#parent-container").classList.add("go-from");
		document.querySelector(".game-card").classList.add("reverse-straighten");
		setIsPaused(true);
		stopTimer();
	}

	const setGameRestartNow = () => {
		document.querySelector("#parent-container").classList.remove("go-from");
		document.querySelector(".game-card").classList.remove("reverse-straighten");
		startGame({setUserWins, setOpponentWins, setUserTies, startTimer, stopTimer})
		setIsPaused(false)
		window.gameEnded = true;
	}

	const quit = () => {
		props.setStart(false);
		window.gameEnded = true;
		document.querySelector(".menu-container").classList.remove("slide-left")
	}


	return (
		<div className = "w-100 h-100" >
			<div className = "game-load">Starting{ellipsis}</div>
			<div style = {{"display": "none"}} className = "game w-100 h-100">

				<div className = "timer">{timer}</div>
				<div className = "user" onClick = {getPausedGameOptions} ><span className = "fa fa-user"></span> {username} <span style ={{"marginLeft": "10px"}} title = "Pause game" className = "fa fa-pause"></span></div>
				<div className = "notification">
					<span className = "fa fa-bell" style = {{"marginRight": "5px"}}></span>
					<span className = "notification-text"></span>
				</div>

				<div id="parent-container" className = "w-100 h-100">
					<div className = "game-card col-xs-12 col-sm-7 col-md-7 col-lg-5 col-10">
						<div className="row flex">
							<div className="box" data-id = "0"></div>
							<div className="box" data-id = "1"></div>
							<div className="box" data-id = "2"></div>
						</div>
						<div className="row">
							<div className="box" data-id = "3"></div>
							<div className="box" data-id = "4"></div>
							<div className="box" data-id = "5"></div>
						</div>
						<div className="row">
							<div className="box" data-id = "6"></div>
							<div className="box" data-id = "7"></div>
							<div className="box" data-id = "8"></div>
						</div>
					</div>
				</div>

				<div className = "score">
					<div className = "score-option difficulty-box w-100"></div>
					<div>
						<div className = "score-option">{username}: {userWins}</div>
						<div className = "score-option">Ties: {userTies}</div>
						<div className = "score-option">{opponent}: {opponentWins}</div>
					</div>
				</div>

			</div>

			{isPaused === true ? <PausedGameMenu setStart = {val => props.setStart(val)} setGameRestartNow = {setGameRestartNow} restart = {restart} setRestart = {(val) => setRestart(val)} setPaused = {setIsPaused} implement = {(value) => props.implement(value)}/> : <div></div>}
		</div>
	)
}

export default GameArea;