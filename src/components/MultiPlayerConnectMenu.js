//Multiplayer connect menu

function MultiPlayerConnectMenu(props) {

	const back = () => {
		props.implement("PLAY_SUB_OPTION");
	}

	//Implement creating a connection
	const create = () => {
		props.implement("CREATE_CONNECTION");
	}

	//Implement joining a connecion
	const join = () => {
		props.implement("JOIN_CONNECTION");
	}

	return (
		<menu className = "multiPlayerConnectMenu">
			<ul>
				<li className = "menu-button" onClick = {create}>
					<span className = "menu-button-icon fa fa-podcast"></span>
					<span>Create<br /> <span className = "menu-sub-button">Create a connection</span></span>
				</li>
				<li className = "menu-button" onClick = {join}>
					<span className = "menu-button-icon fa fa-plug"></span>
					<span>Join<br /> <span className = "menu-sub-button">Join a friend's connection</span></span>
				</li>
				<li className = "menu-button" onClick = {() => back()}>
					<span className = "menu-button-icon fa fa-arrow-left"></span>
					<span>Back</span>
				</li>
			</ul>
		</menu>
	)}
export default MultiPlayerConnectMenu;