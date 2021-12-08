//Single player options board
import {useState, useEffect} from "react";

function Settings (props){

	//Form state
	const [name, setName] = useState(localStorage.getItem("xodata") === null ? "Anon": JSON.parse(localStorage.getItem("xodata")).settings.name);
	const [firstMove, setFirstMove] = useState(localStorage.getItem("xodata") === null ? "Computer": JSON.parse(localStorage.getItem("xodata")).settings.firstMove);
	const [sprite, setSprite] = useState(localStorage.getItem("xodata") === null ? "x" : JSON.parse(localStorage.getItem("xodata")).settings.sprite);
	const [difficulty, setDifficulty] = useState(localStorage.getItem("xodata") === null ? "Dummy": JSON.parse(localStorage.getItem("xodata")).settings.difficulty);
	const [sound, setSound] = useState(localStorage.getItem("xodata") === null ? true: JSON.parse(localStorage.getItem("xodata")).settings.sound);
	const [opponent, setOpponent] = useState(localStorage.getItem("xodata") === null ? "Computer": JSON.parse(localStorage.getItem("xodata")).settings.opponent);
	const [multiplayer, setMultiplayer] = useState(localStorage.getItem("xodata") === null ? false: JSON.parse(localStorage.getItem("xodata")).settings.multiplayer);
	//Update fields
	const setField = (event) => {
		removeSaveIndication();
		const mapping = {name : (val) => setName(val), firstMove : (val) => setFirstMove(val), sprite : (val) => setSprite(val), difficulty: (val) => setDifficulty(val), sound: (val) => setSound(val), difficulty : (val) => setDifficulty(val)};
		mapping[event.target.name](event.target.value);
	}

	//Check all value based on the local storage
	useEffect(() => {
		//Declare target elements
		const firstMove = document.getElementsByName("firstMove");
		const mySprite = document.getElementsByName("sprite");

		//Handle sprite
		if(sprite === "x") mySprite[0].setAttribute("checked", true)
		else mySprite[1].setAttribute("checked", true)

		//Handle first move
		if(firstMove === "Computer") firstMove[1].setAttribute("checked", true);
		else  firstMove[1].setAttribute("checked", true);

	}, [sprite, firstMove])

	//Go pack to previous option
	const back = () => {
		props.implement("")
		if(window.previousMenu === "main"){
			document.querySelector(".menu-container").classList.remove("slide-left");
			document.querySelector(".menu-container").classList.remove("slide-right");
		}else{

		}

		window.previousMenu = undefined;
	}

	//Collect data and start game
	const save = () => {

		const data = {
			name,
			opponent,
			firstMove,
			sprite,
			difficulty,
			multiplayer,
			sound
		}
		window.gameData = data;

		//Save to local storage
		saveToLocalSorage(data);
	}


	//Save to local storage
	function saveToLocalSorage(data){
		if(localStorage.getItem("xodata") !== null){
			const store = JSON.parse(localStorage.getItem("xodata"));
			store.settings = data;
			localStorage.setItem("xodata", JSON.stringify(store))
		}else{
			localStorage.setItem("xodata", JSON.stringify({settings: data}))
		}

		indicateSaved();
	}

	function indicateSaved() {
		document.querySelector(".single-player-log").innerHTML = `
			<div class = "alert alert-success">Setting saved successfully!</div>
		`
	}

	function removeSaveIndication () {
		document.querySelector(".single-player-log").innerHTML = " "
	}


	return(
		<div className = "modal" style = {{"display": "block"}}>
			<div className = "modal-dialog">
				<div className = "modal-content">
					<div className = "modal-header">
						<h5 className = "modal-title">Settings</h5>
					</div>
					<div className = "modal-body">
						<div className = "single-player-log"></div>
						<div className = "form-group">
							<label><strong>Default Player's Name:</strong></label>
							<input  value = {name} name = "name" className = "form-control" type = "text" placeholder = "Player's Name..." id = "name" onChange = {(event) => setField(event)}/>
						</div>
						<div className = "form-group">
							<label><strong>Default First Move:</strong></label>
							<div>
								<span className = "fa single-player-icon fa-male"></span> 
								<input value = {name} type = "radio" className = "single-player-radio" name = "firstMove" onChange = {(event) => setField(event)}/>

								<span  className = "fa single-player-icon fa-desktop"></span> 
								<input value = "computer" type = "radio" className = "single-player-radio" name = "firstMove" onChange = {(event) => setField(event)}/>
							</div>
						</div>
						<div className = "form-group">
							<label><strong>Default Sprite:</strong></label>
							<div>
								<span className = "fa single-player-icon fa-times"></span> 
								<input value = "x" type = "radio" className = "single-player-radio" name = "sprite" onChange = {(event) => setField(event)}/>

								<span  className = "fa single-player-icon fa-circle-o"></span> 
								<input value = "o" type = "radio" className = "single-player-radio" name = "sprite" onChange = {(event) => setField(event)}/>
							</div>
						</div>
						<div className = "form-group">
							<label><strong>Difficulty:</strong></label>
							<div>
								<select className = "form-control" name = "difficulty" onChange = {(event) => setField(event)} value = {difficulty}>
									<option value = "Dummy">Dummy</option>
									<option value = "Novice">Novice</option>
									<option value = "Intermediate">Intermediate</option>
									<option value = "Professional">Professional</option>
									<option value = "Extreme">Extreme</option>
								</select>
							</div>
						</div>
						<div className = "form-group">
							<label><strong>Play Sound:</strong></label>
							<div>
								<select className = "form-control" name = "sound" onChange = {(event) => setField(event)} value = {sound}>
									<option value = "yes">Yes</option>
									<option value = "no">No</option>
								</select>
							</div>
						</div>
					</div>
					<div className = "modal-footer">
						<button className = "btn btn-secondary" onClick = {() => save()}><span className = "fa fa-save" ></span> Save</button>
						<button className = "btn btn-secondary" onClick = {() => back()}><span className = "fa fa-arrow-left"></span> Back</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Settings;