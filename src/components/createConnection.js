//Single player options board
import {useState, useEffect} from "react";
import {io} from "socket.io-client";

var socket;

function CreateConnection (props){

	//States
	const [name, setName] = useState("");
	const [connectionName, setConnectionName] = useState("");
	const [connectionPassword, setConnectionPassword] = useState("");
	const [hasCreated, setHasCreated] = useState(false);
	const [creating, setCreating] = useState(false);
	const [opponent, setOpponent] = useState("");
	const [canStart, setCanStart] = useState(false);
	const [shouldCreate, setShouldCreate] = useState(true);


	//Get connection
	useEffect(() => {
		if(localStorage.getItem("xodata") && ("connection" in JSON.parse(localStorage.getItem("xodata")))){
			const connection = JSON.parse(localStorage.getItem("xodata")).connection;
			setName(connection.name);
			setConnectionName(connection.connectionName);
			setConnectionPassword(connection.connectionPassword);
			setShouldCreate(false);
		}
	}, [])

	useEffect(() => {
		//Create from local storage
		if(!shouldCreate) create();
	},[shouldCreate])


	//Start game
	useEffect(() => {
		
	}, [canStart])

	// //Disable button
	// useEffect(() => {
	// 	if(creating && document.querySelector(".create-button")) document.querySelector(".create-button").setAttribute("disabled", true);
	// 	else if(document.querySelector(".create-button")) document.querySelector(".create-button").removeAttribute("disabled");
	// }, [creating])

	//Go pack to previous option
	const back = () => {
		props.implement("MULTI_PLAYER_CONNECT_MENU");
	}


	//Add fields to state
	const setField = (event) => {
		const mapping = {name: (val) => setName(val), connectionName: (val) => setConnectionName(val), connectionPassword: (val) => setConnectionPassword(val)}
		mapping[event.target.name](event.target.value);
	}


	//Create the connection
	const create = () => {
		setCreating(true);

		if(validate().isEmpty){
			setCreating(false);
			return log(validate().message);
		}

		//Create the websocket connection
		socket = io("https://xandogame-async-api.herokuapp.com/");
		socket.on("connection");

		//Connect
		socket.emit("CREATE_CONNECTION", {name, connectionName, connectionPassword, shouldCreate});

		socket.on("CREATED", (data) => {
			setHasCreated(true);
			log("Connection "+ "<b>"+data.connectionName+"</b>"+ " created successfully", true)

			if(localStorage.getItem("xodata") === null){
				localStorage.setItem("xodata", JSON.stringify(data))
			}else{
				const connection = JSON.parse(localStorage.getItem("xodata"));
				connection["connection"] = data
				localStorage.setItem("xodata", JSON.stringify(connection))
				setHasCreated(true);
			}

			setCreating(false);
		})

		socket.on("DELETE_LOCAL_STORAGE_CONNECTION", () => {
			let data = JSON.parse(localStorage.getItem("xodata"));
			delete data.connection;
			localStorage.setItem("xodata", JSON.stringify(data));
			setHasCreated(false)
			setName("");
			setConnectionName("");
			setConnectionPassword("");
			setOpponent("");
			setCanStart(false);
			setShouldCreate(true);
		})

		socket.on("JOIN", (data) => {
			if(data.opponent !== "" && data.oppoent !== undefined){
				setOpponent(data.name);
			}
		})

		socket.on("PLAY", (data) => {
			start(data);
		})
	}

	//Validate the form field state
	const validate = () => {

		if(name.toString().trim() === "") return {isEmpty: true, message: "Username cannot be left empty"}

		if(connectionName.toString().trim() === "") return {isEmpty: true, message: "Connection name cannot be left empty"}

		if(connectionPassword.toString().trim() === "") return {isEmpty: true, message: "Connection password cannot be left empty"}

		return {isEmpty: false}
	}

	const log = (message, isSuccess) => {
		let log = document.querySelector(".multiplayer-player-log");

		//Clear log on no message
		if(isSuccess && message.toString().trim() === ""){
			return log.innerHTML = "";
		}

		//Add success message to log
		if(isSuccess) return log.innerHTML = `
			<div class = "alert alert-success">${message}</div>
		`

		//Add failure message to log
		if(!isSuccess) return log.innerHTML = `
			<div class = "alert alert-danger">${message}</div>
		`
	}


	const start = (data) => {
		const joinedData = {
		name : data.name,
		opponent: data.users[data.visitor],
		firstMove: data.toPlay,
		sprite: data.sprites[data.socketID],
		difficulty: "Extreme",
		multiplayer: true,
		sound: "no",
		socket: socket,
		connectionId: data.connectionId
		}

		window.gameData = joinedData;

		//Close the board
		props.implement("");

		props.start();
		console.log(data);

	}

	//Disconnect the websocket
	const disconnect = () => {
		socket.emit("DELETE_CONNECTION")
		setHasCreated(false)
		setName("");
		setConnectionName("");
		setConnectionPassword("");
		setOpponent("");
		setShouldCreate(true);
		setCanStart(false);
		let data = JSON.parse(localStorage.getItem("xodata"));
		log("", true)
		delete data.connections;
		localStorage.setItem("xodata", JSON.stringify(data));
	}

	return(
		<div className = "modal" style = {{"display": "block"}}>
			<div className = "modal-dialog">
				<div className = "modal-content">
					<div className = "modal-header">
						<h5 className = "modal-title">Create Connection</h5>
					</div>
					<div className = "modal-body">
						<div className = "multiplayer-player-log"></div>
						{
							(!hasCreated) ? 
							(<div>
								<div className = "form-group">
									<label><strong>Player's Name:</strong></label>
									<input  value = {name} name = "name" className = "form-control" type = "text" placeholder = "Player's Name..." id = "name" onChange = {(event) => setField(event)}/>
								</div>
								<div className = "form-group">
									<label><strong>Connection Name:</strong></label>
									<input  value = {connectionName} name = "connectionName" className = "form-control" type = "text" placeholder = "Connection Name..." id = "connectionName" onChange = {(event) => setField(event)}/>
								</div>
								<div className = "form-group">
									<label><strong>Connection Password:</strong></label>
									<input   value = {connectionPassword} name = "connectionPassword" className = "form-control" type = "password" placeholder = "******" id = "connectionPassowrd" onChange = {(event) => setField(event)}/>
								</div>
							</div>)
							:
							(<div>
								<ul className = "list-group">
									<li>
										<div>
											<span>{connectionName}</span>
											<div>
												<small>Author: {name}</small>
											</div>
											<div>
												<small>Opponent: {opponent}</small>
											</div>
										</div>
									</li>
								</ul>
								<strong></strong>
							</div>)
						}

						

					</div>
					<div className = "modal-footer">
						{
							(!hasCreated)? <button className = "create-button btn btn-secondary"  onClick = {() => create()}><span className = "fa fa-podcast"></span> {creating === false ? "Create": "Creating..."}</button>
							:
							<button className = "btn btn-danger" onClick = {disconnect}>Disconnect</button>
						}
						
						<button className = "btn btn-secondary" onClick = {() => back()}><span className = "fa fa-arrow-left"></span> Back</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateConnection;