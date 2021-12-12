//Single player options board
import {useState, useEffect} from "react";
import io from 'socket.io-client';

//Variables
var socket;

function JoinConnection (props){

	const [foundConnections, setFoundConnections] = useState(false);
	const [noConnection, setNoConnections] = useState(false);
	const [connections, setConnections] = useState([])
	const [isSearch, setIsSearch] = useState(false)
	const [tryPassword, setTryPassword] = useState("");
	const [tryConnectionId, setTryConnectionId] = useState("");
	const [tryName, setTryName] = useState("");

	//Go pack to previous option
	const back = () => {
		props.implement("MULTI_PLAYER_CONNECT_MENU");
	}

	//Fetch connections
	useEffect(() => {

		//If socket exist then disconnect socket
		if(socket){
			//Clear the search state checkers
			setFoundConnections(false);
			setNoConnections(false)
			socket.emit("DISCONNECT");
		}

		socket = io("http://localhost:8000");

		socket.emit("FETCH_CONNECTIONS");

		socket.on("CONNECTIONS", (data) => {
			if(data.length === 0){
				setFoundConnections(true);
				setNoConnections(true);
			}else{
				setFoundConnections(true);
				setNoConnections(false);
				setConnections(data);
			}
		})

		socket.on("CONNECTIONS_CHANGED", () => {
			if(document.querySelector(".search-connection")) document.querySelector(".search-connection").click();
		})
	}, [isSearch])


	//Handle search 
	const search = () => {
		if(isSearch) return setIsSearch(false)

		return setIsSearch(true);
	}

	//Toggle list group password field
	const showPasswordField = (event) => {

		//Add the set the connection id
		setTryConnectionId(event.target.getAttribute("data-id"));
		const listGroup = document.querySelectorAll(".list-group");
		listGroup.forEach((item, index) => {
			item.children[1].style.display = "none";
		})
		event.target.nextSibling.style.display = "flex";
	}

	//Send the  join request to the server
	const sendJoinRequest = () => {

		socket.emit("JOIN_CONNECTION", {connectionPassword: tryPassword, connectionId: tryConnectionId, name: tryName})

		socket.on("PLAY", (data) => {
			start(data);
		})
	}


	//Collect data and start game
	const start = (data) => {
		const joinedData = {
			name : data.users[data.visitor],
			opponent: data.users[data.author],
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

	return(
		<div className = "modal" style = {{"display": "block"}}>
			<div className = "modal-dialog">
				<div className = "modal-content">
					<div className = "modal-header">
						<h5 className = "modal-title">Join Connection</h5>
					</div>
					<div className = "modal-body">
						<div className = "single-player-log"></div>
						{
							(!foundConnections && noConnection === false) ? <strong>Searching ...</strong>
							:
							(foundConnections && noConnection === true) ? <div>No connections found</div> : 
							connections.map((item, index) => {
								return	<div key = {index} className = "list-group" >
											 <div onClick = {(event) => showPasswordField(event)} data-id = {item.connectionId} key = {index} className = "d-flex align-items-between list-group-item connection-list" style = {{"justifyContent": "space-between", "flexDirection": "row"}}>
												{item.connectionName}
											</div>
											<div className = "btn-group connection-password-box" style = {{"display": "none", "flex-wrap": "wrap"}}>
												<input value = {tryName} onChange = {(event) => setTryName(event.target.value)} placeholder = "User Name..." type = "text" />
												<input value = {tryPassword} onChange = {(event) => setTryPassword(event.target.value)} placeholder = "Connection Password..." type = "text" />
												<button className = "btn btn-secondary" onClick = {sendJoinRequest}>
														<span className = "fa fa-play"></span> 
														Play
												</button>
											</div>
										</div>
							})
						}
					</div>
					<div className = "modal-footer">
						<button className = "btn btn-secondary search-connection" onClick = {search}><span className = "fa fa-search" ></span> Search</button>
						<button className = "btn btn-secondary" onClick = {() => back()}><span className = "fa fa-arrow-left"></span> Back</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default JoinConnection;