//Drop down prompt

import {useEffect,} from "react";
function DropDownPrompt (props){

	//Accept the prompt
	const accept = () => {
		props.promptResponse(true);
	}

	useEffect(() => {
		//check that the element has been loaded
		//then determine to show or hide the prompt
		if(document.querySelector(".notification-prompt-background")){
			if(props.message !== ""){
				document.querySelector(".notification-prompt-background").style.display = "flex";
				setTimeout(() => {
					document.querySelector(".notification-prompt").classList.add("slide-down");
				})
			}
		}
	}, [props.message])

	//Reject the prompt
	const reject = () => {
		props.promptResponse(false);
	}

	if(props.message !== ""){
		return (
			<div className = "notification-prompt-background">
				<div className = "notification-prompt">
					<span className = "notification-text">{props.message}</span>
					<div style = {{"marginTop": "10px"}}>
						<button className = "btn btn-secondary" onClick = {accept}><span  className = "fa fa-check"></span> Ok</button>
						<button style = {{"marginLeft": "10px"}} className = "btn btn-secondary" onClick = {reject}><span  className = "fa fa-close"></span> Cancel</button>
					</div>
				</div>
			</div>
		)
	}else{
		return <div></div>
	}
}

export default DropDownPrompt;