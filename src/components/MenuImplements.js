//Each menu options implementations
import PlaySubMenu from "./PlaySubMenu";
import SinglePlayerOptionsBoard from "./SinglePlayerOptionsBoard"

function MenuImplements(props){
	switch (props.type) {
		case "PLAY_SUB_OPTION": 
			return <PlaySubMenu implement = {(value) => props.implement(value)}/>

		case "SINGLE_PLAYER_BOARD":
			return <SinglePlayerOptionsBoard start = {() => props.start()} implement = {(value) => props.implement(value)}/>

		default: return <div></div>
	}
}

export default MenuImplements;