//Menu Component
import "./../stylesheets/Menu.css"
function Menu (props) {

	const hideMenuLeft = () => {
		//Remove the menu on menu options click
		const menu = document.querySelector(".menu-container")
		menu.classList.add("slide-left");
	}

	const hideMenuRight = () => {
		//Remove the menu on menu options click
		const menu = document.querySelector(".menu-container")
		menu.classList.add("slide-right");
	}

	const play = () => {
		//Remove the menu on menu options click
		hideMenuLeft();
		//Toggle the play options
		props.implement("PLAY_SUB_OPTION")
	}

	const settings = () => {
		//Remove the menu on menu options click
		hideMenuRight()
	}

	return (
		<menu className = "menu-container">
			<ul>
				<li className = "menu-button" onClick = {() => play()}>
					<span className = "menu-button-icon fa fa-play"></span>
					<span>Play <br /> <span className = "menu-sub-button">Start the game</span></span>
				</li>
				<li className = "menu-button" onClick = {() => settings()}>
					<span className = "menu-button-icon fa fa-cog"></span>
					<span>Settings <br /> <span className = "menu-sub-button">Customize Game</span></span>
				</li>
				<li className = "menu-button" onClick = {() => settings()}>
					<span className = "menu-button-icon fa fa-cog"></span>
					<span>History <br /> <span className = "menu-sub-button">Game History</span></span>
				</li>
				<li className = "menu-button">
					<span className = "menu-button-icon fa fa-exclamation"></span>
					<span>About</span>
				</li>
			</ul>
		</menu>
	)
}
export default Menu;