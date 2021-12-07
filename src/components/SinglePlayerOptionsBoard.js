//Single player options board
import {useState} from "react";

function SinglePlayerOptionsBoard (props){

	//Form state
	const [name, setName] = useState("Anon");
	const [firstMove, setFirstMove] = useState("Computer");
	const [sprite, setSprite] = useState("x");
	const [difficulty, setDifficulty] = useState("Dummy");

	//Update fields
	const setField = (event) => {
		const mapping = {name : (val) => setName(val), firstMove : (val) => setFirstMove(val), sprite : (val) => setSprite(val), difficulty: (val) => setDifficulty(val)};
		mapping[event.target.name](event.target.value);
	}

	//Go pack to previous option
	const back = () => {
		console.log("cool")
		props.implement("PLAY_SUB_OPTION");
	}

	//Collect data and start game
	const start = () => {
		const data = {
			name: name === "" ? "Me": name.trim().toLowerCase().replace(name[0], name[0].toUpperCase()),
			opponent: "Computer",
			firstMove,
			sprite,
			difficulty,
			multiplayer: false
		}
		window.gameData = data;

		//Close the board
		props.implement("");

		props.start();
	}


	return(
		<div className = "modal" style = {{"display": "block"}}>
			<div className = "modal-dialog">
				<div className = "modal-content">
					<div className = "modal-header">
						<h5 className = "modal-title">Single Player</h5>
					</div>
					<div className = "modal-body">
						<div className = "single-player-log"></div>
						<div className = "form-group">
							<label><strong>Player's Name:</strong></label>
							<input  value = {name} name = "name" className = "form-control" type = "text" placeholder = "Player's Name..." id = "name" onChange = {(event) => setField(event)}/>
						</div>
						<div className = "form-group">
							<label><strong>First Move:</strong></label>
							<div>
								<span className = "fa single-player-icon fa-male"></span> 
								<input value = {name} type = "radio" className = "single-player-radio" name = "firstMove" onChange = {(event) => setField(event)}/>

								<span  className = "fa single-player-icon fa-desktop"></span> 
								<input value = "computer" type = "radio" className = "single-player-radio" name = "firstMove" onChange = {(event) => setField(event)}/>
							</div>
						</div>
						<div className = "form-group">
							<label><strong>Select Sprite:</strong></label>
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
								<select className = "form-control">
									<option value = "Dummy">Dummy</option>
									<option value = "Novice">Novice</option>
									<option value = "Intermediate">Intermediate</option>
									<option value = "Professional">Professional</option>
									<option value = "Extreme">Extreme</option>
								</select>
							</div>
						</div>
					</div>
					<div className = "modal-footer">
						<button className = "btn btn-secondary" onClick = {() => start()}><span className = "fa fa-play" ></span> Start</button>
						<button className = "btn btn-secondary" onClick = {() => back()}><span className = "fa fa-arrow-left"></span> Back</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SinglePlayerOptionsBoard;