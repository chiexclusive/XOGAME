import './stylesheets/App.css';
import Menu from "./components/Menu";
import MenuImplements from "./components/MenuImplements";
import {useState} from "react";
import GameArea from "./components/GameArea";

function App() {

	const [implementType, setImplementType] = useState("");
	const [start, setStart] = useState(false);
	
	return (
		<div className="app-space">
			<title>X and O</title>
		  <Menu implement = {(value) => setImplementType(value)} />
		  <MenuImplements start = {() => setStart(true)} implement = {(value) => setImplementType(value)} type = {implementType}/>
		  {(start)? <GameArea setStart = {setStart} implement = {(value) => setImplementType(value)} />: ""}
		</div>
	);
}

export default App;
