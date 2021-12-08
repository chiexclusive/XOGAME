//Paused game menu options
import DropDownPrompt from "./DropDownPrompt.js"

import {useEffect, useState} from "react";

function PausedGameMenu (props){

	const [message, setMessage] = useState("");
	const resume = () => {
		//Modify paused state of the game
		props.setPaused(false);
	}


	useEffect(() => {
		if(props.restart) setMessage("Are you sure you want to restart this game?");
		window.promptType = "restart";
		props.setRestart(false);
	}, [props.restart]);

	//Handle Prompt
	const handlePrompt = (isAccepted) => {
		if(isAccepted === true && window.promptType === "restart") props.setGameRestartNow();
		if(isAccepted === true && window.promptType === "quit"){
			props.setStart(false);
			window.gameEnded = true;
			document.querySelector(".menu-container").classList.remove("slide-left")
		}
		setMessage("");
	}

	//Handle quit game
	const handleQuit =  () => {
		setMessage("Are you sure you want to quit this game?");
		window.promptType = "quit"
	}

	function settings(){
		//Remove the menu on menu options click
		window.previousMenu = "game";
		props.implement("SETTINGS");
	}

	return (
		<div className = "paused-background">
			<menu className = "paused-menu-container">
				<ul>
					<li className = "menu-button" onClick = {() => resume()}>
						<span className = "menu-button-icon fa fa-play"></span>
						<span>Resume <br /> <span className = "menu-sub-button">Continue game</span></span>
					</li>
					<li className = "menu-button" onClick = {() => props.setRestart(true)}>
						<span className = "menu-button-icon fa fa-circle-o-notch"></span>
						<span>Restart</span>
					</li>
					<li className = "menu-button" onClick = {() => settings()}>
						<span className = "menu-button-icon fa fa-cog"></span>
						<span>Settings <br /> <span className = "menu-sub-button">Customize Game</span></span>
					</li>
					<li className = "menu-button" onClick = {handleQuit}>
						<span className = "menu-button-icon fa fa-close"></span>
						<span>Quit</span>
					</li>
				</ul>
			</menu>
			<DropDownPrompt message = {message} promptResponse = {(val) => handlePrompt(val)}/> 
		</div>
	)
}

export default PausedGameMenu;