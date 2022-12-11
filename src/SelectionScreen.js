import React, { useState, useEffect } from "react";

const prompts = [
	"Which playlist do you play most often?",
	"Which playlist do you listen to most when you're alone?",
	"You're on aux at a party. Which playlist do you play?"
];

export default function SelectionScreen(props) {

	const [phase, setPhase] = useState(0);

	useEffect(() => {
	    
	  }, []);

	const handleClick = (id) => {
		props.setId(id, phase);
		if (phase < 2) {
			setPhase(phase+1);
		} else {
			props.setState(2);
		}
	}

	if (props.playlists[0]) {
		return (
			<div className="selection-screen">
			 	<h2>{prompts[phase]}</h2>
				<ul className="playlists">
					{props.playlists.map(playlist => <li onClick={() => handleClick(playlist.id)}>{playlist.name}</li>)}
				</ul>
			</div>
		);
	} else {
		return <p>Loading...</p>;
	}
}