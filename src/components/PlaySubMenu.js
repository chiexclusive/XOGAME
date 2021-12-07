//Options under the play menu option

function PlaySubMenu (props) {

	const singlePlayer = () => {
		//Selete all sub menu
		const thisContainer = document.querySelector(".play-menu-container");
		thisContainer.classList.add("slide-right");
		
		//Toggle the single player board settings
		setTimeout(() => props.implement("SINGLE_PLAYER_BOARD"), 500);

	}

	const back = () => {
		const menuContainer = document.querySelector(".menu-container");
		const thisContainer = document.querySelector(".play-menu-container");
		menuContainer.classList.remove("slide-left");
		thisContainer.classList.add("slide-right");
		props.implement(" ");
	}

	return (
		<menu className = "play-menu-container">
			<ul>
				<li className = "menu-button hide">
					<span className = "menu-button-icon fa fa-play"></span>
					<span>Continue <br /> <span className = "menu-sub-button">Continue game</span></span>
				</li>
				<li className = "menu-button hide">
					<span className = "menu-button-icon fa fa-circle-o-notch"></span>
					<span>Restart <br /> <span className = "menu-sub-button">Restart game</span></span>
				</li>
				<li className = "menu-button" onClick = {() => singlePlayer()}>
					<span className = "menu-button-icon fa fa-user"></span>
					<span>Single Player<br /> <span className = "menu-sub-button">Play Solo</span></span>
				</li>
				<li className = "menu-button">
					<span className = "menu-button-icon fa fa-users"></span>
					<span>Multiplayer<br /> <span className = "menu-sub-button">Play with friends</span></span>
				</li>
				<li className = "menu-button" onClick = {() => back()}>
					<span className = "menu-button-icon fa fa-arrow-left"></span>
					<span>Back</span>
				</li>
			</ul>
		</menu>
	)
}

export default PlaySubMenu;
