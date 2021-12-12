//Each menu options implementations
import PlaySubMenu from "./PlaySubMenu";
import SinglePlayerOptionsBoard from "./SinglePlayerOptionsBoard";
import Settings from "./Settings";
import MultiPlayerConnectMenu from  "./MultiPlayerConnectMenu";
import CreateConnection from "./createConnection";
import JoinConnection from "./joinConnection";

function MenuImplements(props){
	switch (props.type) {
		case "PLAY_SUB_OPTION": 
			return <PlaySubMenu implement = {(value) => props.implement(value)}/>

		case "SETTINGS": 
			return <Settings implement = {(value) => props.implement(value)}/>

		case "SINGLE_PLAYER_BOARD":
			return <SinglePlayerOptionsBoard start = {() => props.start()} implement = {(value) => props.implement(value)}/>

		case "MULTI_PLAYER_CONNECT_MENU":
			return <MultiPlayerConnectMenu start = {() => props.start()} implement = {(value) => props.implement(value)}/>

		case "CREATE_CONNECTION":
			return <CreateConnection start = {() => props.start()}  implement = {(value) => props.implement(value)}/>

		case "JOIN_CONNECTION":
			return <JoinConnection start = {() => props.start()} implement = {(value) => props.implement(value)}/>

		default: return <div></div>
	}
}

export default MenuImplements;